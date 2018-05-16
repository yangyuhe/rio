import { ForExp } from "../models";
import { MVVM } from '../mvvm/mvvm';
import { VDom, NewVNodeNoFor } from '../vdom/vdom';
import { CustomNode } from './custom-node';
import { VNode } from "./vnode";
import { VNodeStatus } from "../const";

export class ForNode extends VNode{
    private dynamicVNodes:CustomNode[] = []
    public ForExp:ForExp
    constructor(public Vdom:VDom,public mvvm: MVVM,public Parent:VNode,private originForExp:string) {
        super(Vdom,mvvm,Parent)
        this.IsTemplate=true       
        let forSplit=this.originForExp.trim().split(/\s+/)
        this.ForExp=new ForExp(forSplit[0],forSplit[2]) 
    }
    private newCopyNode(n:number){
        let itemexp=this.ForExp.itemExp
        let mvvm=new MVVM({props:[{name:itemexp,required:true}]})
        mvvm.SetHirented(true)

        let fencenode=new CustomNode(this.Vdom,this.mvvm,null,mvvm)
        mvvm.$FenceNode=fencenode        
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
                
                let vnode=NewVNodeNoFor(this.Vdom,custnode.SurroundMvvm,null)
                vnode.AttachDom()
                custnode.SurroundMvvm.$TreeRoot=vnode
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
        let items=this.mvvm.GetExpValue(this.ForExp.arrayExp)
        if(toString.call(items) === "[object Array]"){
            this.reImplementForExp(items.length)
        }
    }
    AttachDom() {}
    Render(){
        this.mvvm.$watchExpOrFunc(this,this.ForExp.arrayExp+".length",this.reImplementForExp.bind(this))
    }
    OnRemoved(){
        this.dynamicVNodes.forEach(vnode=>vnode.OnRemoved())
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        this.dynamicVNodes.forEach(vnode=>vnode.SetStatus(status))
    }
}