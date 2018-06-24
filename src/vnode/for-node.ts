import { ComponentMvvm } from './../mvvm/component-mvvm';
import { ForExp, Prop } from "../models";
import { Mvvm } from '../mvvm/mvvm';
import { VDom, NewVNode, Priority } from '../vdom/vdom';
import { CustomNode } from './custom-node';
import { VNode } from "./vnode";
import { VNodeStatus } from "../const";

export class ForNode extends VNode{
    private dynamicVNodes:CustomNode[] = []
    public ForExp:ForExp
    constructor(public Vdom:VDom,public mvvm: Mvvm,public Parent:VNode,private originForExp:string) {
        super(Vdom,mvvm,Parent)
        this.IsTemplate=true       
        let forSplit=this.originForExp.trim().split(/\s+/)
        this.ForExp=new ForExp(forSplit[0],forSplit[2]) 
    }
    private newCopyNode(n:number){
        let itemexp=this.ForExp.itemExp
        let that=this
        let mvvm=new (class extends ComponentMvvm{
            $InitTreeroot(): VNode {
                let vnode=NewVNode(that.Vdom,this,null,Priority.IF)
                return vnode
            }
            $InitNamespace(): string {
                return that.mvvm.$InitNamespace();
            }
            $InitDataItems(): {name:string,value:any}[] {
                let datas:{name:string,value:any}[]=[]
                that.mvvm.$GetDataItems().forEach(item=>{
                    datas.push({name:item.name,value:(that.mvvm as any)[item.name]})
                })
                that.mvvm.$GetComputedItems().forEach(item=>{
                    datas.push({name:item.name,value:(that.mvvm as any)[item.name]})
                })
                if(that.mvvm instanceof ComponentMvvm){
                    let props=that.mvvm.$GetIns()
                    props.forEach(prop=>{
                        datas.push({name:prop.name,value:(that.mvvm as any)[prop.name]})
                    })
                }
                
                return datas
            }
            $InitComputeItems(): { name: string; get: () => any }[] {
                return []
            }
            $InitName():string{
                return ""
            }
            $InitIns():Prop[]{
                return [{name:itemexp,required:true}]
            }
            $InitOuts():string[]{
                return []
            }
            $GetParams():{alias:string,name:string,required:boolean}[]{
               return []
            }
        });
        mvvm.$initialize()
        mvvm.$SetHirented(true)

        let fencenode=new CustomNode(this.Vdom,this.mvvm,null,mvvm)
        mvvm.$SetFenceNode(fencenode)     
        fencenode.IsCopy=true
        fencenode.AddIns(itemexp,this.ForExp.arrayExp+"["+n+"]")
        return fencenode
    }
    private reImplementForExp(newcount:number){
        if(newcount>this.dynamicVNodes.length){
            let custnodes:CustomNode[]=[]
            let oldcount=this.dynamicVNodes.length
            for(let i=this.dynamicVNodes.length;i<newcount;i++){       
                let custnode=this.newCopyNode(i)
                custnode.Source=this
                custnodes.push(custnode)
            }
            custnodes.forEach(custnode=>{
                this.dynamicVNodes.push(custnode)                    
                custnode.Render()
            })
            this.Parent.AddChildren(this,custnodes,oldcount)
            this.Parent.Refresh()
            return
        }
        if(newcount<this.dynamicVNodes.length){
            let moved=this.dynamicVNodes.splice(newcount)
            moved.forEach(vnode=>vnode.SetStatus(VNodeStatus.DEPRECATED))
            this.Parent.RemoveChildren(moved)
            moved.forEach(item=>{
                item.OnRemoved()
            })
            this.Parent.Refresh()
        }
    }
    
    Update(){
        let items=this.mvvm.$GetExpValue(this.ForExp.arrayExp)
        if(toString.call(items) === "[object Array]"){
            this.reImplementForExp(items.length)
        }
    }
    AttachDom() {}
    Render(){
        this.mvvm.$Watch(this,this.ForExp.arrayExp+".length",this.reImplementForExp.bind(this))
    }
    OnRemoved(){
        this.dynamicVNodes.forEach(vnode=>vnode.OnRemoved())
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        this.dynamicVNodes.forEach(vnode=>vnode.SetStatus(status))
    }
}