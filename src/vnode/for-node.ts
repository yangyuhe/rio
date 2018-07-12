import { VNodeStatus } from "../const";
import { EvalExp } from '../eval';
import { DomStatus, ForExp } from "../models";
import { Mvvm } from '../mvvm/mvvm';
import { NewVNode, Priority, VDom } from '../vdom/vdom';
import { DomType } from './../const';
import { VNode } from "./vnode";
import { TemplateNode } from "./template-node";

export class ForNode extends VNode{
    public ForExp:ForExp
    constructor(public Vdom:VDom,public mvvm: Mvvm,public Parent:VNode,private originForExp:string) {
        super(Vdom,mvvm,Parent)
        let forSplit=this.originForExp.trim().split(/\s+/)
        this.ForExp=new ForExp(forSplit[0],forSplit[2]) 
    }
    private newCopyNode(n:number){
        let itemexp=this.ForExp.itemExp;
        let itemexpValue=this.ForExp.arrayExp+"["+n+"]";
        let that=this;
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
                    get:function(){
                        return mvvm.$GetExpOrFunValue(itemexpValue);
                    },
                    enumerable:true,
                    configurable:true
                });
                Object.defineProperty(mvvm,"$index",{
                    value:n,
                    configurable:true,
                    enumerable:true
                })
                
                return mvvm
            }
            $RevokeMethod(method:string,...params:any[]){
                let mvvm=this.$ExtendMvvm();
                mvvm.$RevokeMethod(method,...params);
            }
        });
        let vnode=NewVNode(this.Vdom,mvvm,this,Priority.IF);
        vnode.AttachChildren();
        return vnode;
    }
    private implementForExp(newcount:number){
        if(newcount>this.Children.length){
            let custnodes:TemplateNode[]=[]
            for(let i=this.Children.length;i<newcount;i++){       
                let custnode=this.newCopyNode(i)
                custnodes.push(custnode)
            }
            custnodes.forEach(custnode=>{
                this.Children.push(custnode)                    
                this.DomSet=this.DomSet.concat(custnode.Render())
            })
            this.Parent.Reflow()
            return
        }
        if(newcount<this.Children.length){
            let moved=this.Children.splice(newcount)
            moved.forEach(moveditem=>{
                this.DomSet.forEach(dom=>{
                    let exist=moveditem.DomSet.some(moveddom=>{
                        return moveddom.dom==dom.dom
                    })
                    if(exist){
                        dom.type=DomType.DELETE
                    }
                })
            })
            
            moved.forEach(vnode=>vnode.SetStatus(VNodeStatus.DEPRECATED))
            moved.forEach(item=>{
                item.OnDestroy()
            })
        }
    }
    
    Update(){
        let items=this.mvvm.$GetExpOrFunValue(this.ForExp.arrayExp)
        if(toString.call(items) === "[object Array]"){
            this.implementForExp(items.length)
        }
    }
    AttachChildren() {
        let num=this.mvvm.$GetExpOrFunValue(this.ForExp.arrayExp+".length")
        for(let i=0;i<num;i++){
            this.Children.push(this.newCopyNode(i))
        }
    }
    Render():DomStatus[]{
        this.mvvm.$CreateWatcher(this,this.ForExp.arrayExp+".length",this.implementForExp.bind(this))

        this.Children.forEach(child=>{
            this.DomSet=this.DomSet.concat(child.Render())
        })
        return this.DomSet;
    }
    OnDestroy(){
        this.Children.forEach(vnode=>vnode.OnDestroy())
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        this.Children.forEach(vnode=>vnode.SetStatus(status))
    }
    
}