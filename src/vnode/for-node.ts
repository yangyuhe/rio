import { VNodeStatus } from "../const";
import { Diff } from "../diff/diff";
import { EvalExp } from '../eval';
import { DomStatus, ForExp, Prop } from "../models";
import { Mvvm } from '../mvvm/mvvm';
import { Watcher } from "../observer/watcher";
import { NewVNode, Priority } from '../vdom/vdom';
import { DomType } from '../const';
import { VNode } from "./vnode";
import { CustDom } from "../vdom/parser";

export class ForNode extends VNode{
    private forExp:ForExp;
    private indexName:string;
    private arrayExpWatcher:Watcher;
    constructor(public Vdom:CustDom,public mvvm: Mvvm,public Parent:VNode,private originForExp:string) {
        super(Vdom,mvvm,Parent)
        let items=this.originForExp.trim().split(";");
        let forSplit=items[0].split(/\s+/);
        this.forExp=new ForExp(forSplit[0],forSplit[2]);

        if(items.length>1){
            let kvs=items[1].split("=");
            if(kvs.length==2){
                if(kvs[1]=="$index")
                    this.indexName=kvs[0];
                else
                    throw new Error("unrecognized variable "+kvs[1]);
            }
        }
    }
    private newCopyNode(item:any){
        let that=this;
        let itemexp=this.forExp.itemExp;
        let mvvm=new (class extends Mvvm{
            $InitDataItems(): { name: string; value: any; }[] {
                return [];
            }
            $InitComputeItems(): { name: string; get: () => any; }[] {
                return [];
            }
            $Render(): DomStatus {
                return null;
            }
            protected $hirented=that.mvvm;
            $InitTreeroot(): VNode {
                return null;
            }
            $InitNamespace(): string {
                return that.mvvm.$InitNamespace();
            }
            $GetExpOrFunValue(exp:string):any{
                let mvvm=this.$ExtendMvvm()
                return EvalExp(mvvm,exp)
            }
            $ExtendMvvm(){
                let mvvm=that.mvvm.$ExtendMvvm();
                
                Object.defineProperty(mvvm,itemexp,{
                    value:item,
                    enumerable:true,
                    configurable:true
                });
                if(that.indexName!=null)
                    Object.defineProperty(mvvm,that.indexName,{
                        get:function(){
                            let items=mvvm.$GetExpOrFunValue(that.forExp.arrayExp);
                            return items.indexOf(item);
                        },
                        configurable:true,
                        enumerable:true
                    });
                else
                    Object.defineProperty(mvvm,"$index",{
                        get:function(){
                            let items=mvvm.$GetExpOrFunValue(that.forExp.arrayExp);
                            return items.indexOf(item);
                        },
                        configurable:true,
                        enumerable:true
                    });
                
                return mvvm
            }
            $RevokeMethod(method:string,...params:any[]){
                let mvvm=this.$ExtendMvvm();
                mvvm.$RevokeMethod(method,...params);
            }
            $DecoratorStates():Prop[]{return []}
        });
        let vnode=NewVNode(this.Vdom,mvvm,this,Priority.IF);
        vnode.AttachChildren();
        return vnode;
    }
    private implementForExp(newitems:any[],olditems:any[]){
        let opers=Diff(olditems,newitems);
        
        let childToDeleted:VNode[]=[];
        opers.forEach(oper=>{
            if(oper.type=="add"){
                let custnode=this.newCopyNode(newitems[oper.newSetIndex]);
                custnode.Render();
                if(oper.oldSetIndex==-1){
                    this.Children.unshift(custnode);
                }else{
                    this.Children.splice(oper.oldSetIndex+1,0,custnode);
                }
            }
            if(oper.type=="remove"){
                childToDeleted.push(this.Children[oper.oldSetIndex]);
            }
            if(oper.type=="replace"){
                let custnode=this.newCopyNode(newitems[oper.newSetIndex]);
                custnode.Render();
                childToDeleted.push(this.Children[oper.oldSetIndex]);

                this.Children.splice(oper.oldSetIndex,0,custnode);
            }
        });
        childToDeleted.forEach(i=>{
            i.SetStatus(VNodeStatus.DEPRECATED);
            i.OnDestroy();
            i.statefulDom.forEach(dom=>{
                dom.type=DomType.DELETE;
            });
        });
        this.statefulDom=[];
        this.Children.forEach(child=>{
            this.statefulDom=this.statefulDom.concat(child.statefulDom);
        });
        this.Children=this.Children.filter(child=>{
            return !childToDeleted.includes(child);
        });

        this.Parent.Reflow();
    }
    
    

    
    Update(){
        let olditems=this.arrayExpWatcher.GetCurValue();
        let newitems=this.mvvm.$GetExpOrFunValue(this.forExp.arrayExp)
        if(toString.call(newitems) === "[object Array]"){
            this.implementForExp(newitems,olditems);
        }else{
            throw new Error(`${this.forExp.arrayExp} must be an array`);
        }
    }
    AttachChildren() {
        let array=this.mvvm.$GetExpOrFunValue(this.forExp.arrayExp);
        if(toString.call(array)=="[object Array]"){
            for(let value of array){
                let child=this.newCopyNode(value);
                this.Children.push(child);
            }
        }else{
            throw new Error(`${this.forExp.arrayExp} must be an array`);
        }
        
    }
    Render():DomStatus[]{
        this.arrayExpWatcher=this.mvvm.$CreateWatcher(this,this.forExp.arrayExp,this.implementForExp.bind(this),true);

        this.Children.forEach(child=>{
            this.statefulDom=this.statefulDom.concat(child.Render())
        })
        return this.statefulDom;
    }
    OnDestroy(){
        this.Children.forEach(vnode=>vnode.OnDestroy())
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        this.Children.forEach(vnode=>vnode.SetStatus(status))
    }
    
}