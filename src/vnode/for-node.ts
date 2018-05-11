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
        let mvvm=new MVVM({props:[itemexp]})
        mvvm.SetHirented(true)

        let fencenode=new CustomNode(this.Vdom,this.mvvm,null,mvvm)
        mvvm.FenceNode=fencenode        
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
                custnode.SurroundMvvm.TreeRoot=vnode
                custnodes.push(custnode)
            }
            custnodes.forEach(custnode=>{
                this.dynamicVNodes.push(custnode)                    
                custnode.Reconstruct()
                custnode.Render()
                custnode.StartWatch()
            })
            this.Parent.AddChildren(this,custnodes,oldcount)
            this.Parent.Refresh()
            return
        }
        if(newcount<this.dynamicVNodes.length){
            let moved=this.dynamicVNodes.splice(newcount)
            moved.forEach(vnode=>vnode.SetStatus(VNodeStatus.DEPRECATED))
            this.Parent.RemoveChildren(moved)
            this.Parent.Refresh()
        }
    }
    
    Reconstruct(){
        let items=this.mvvm.GetExpValue(this.ForExp.arrayExp)
        this.dynamicVNodes=[]
        if(toString.call(items) === "[object Array]"){
            let copynodes:CustomNode[]=[]
            for(let i=0;i<items.length;i++){       
                let copynode=this.newCopyNode(i)

                let vnode=NewVNodeNoFor(this.Vdom,copynode.SurroundMvvm,null)
                vnode.AttachDom()
                copynode.SurroundMvvm.TreeRoot=vnode
                copynodes.push(copynode)
            }
            copynodes.forEach(copynode=>{
                this.dynamicVNodes.push(copynode)                    
                copynode.Reconstruct()
            })
            this.Parent.AddChildren(this,copynodes,0)
        }
        
    }
    StartWatch(){
        this.mvvm.$watchExp(this,this.ForExp.arrayExp+".length",this.reImplementForExp.bind(this))
        this.dynamicVNodes.forEach(node=>node.StartWatch())
    }
    Update(){
        let items=this.mvvm.GetExpValue(this.ForExp.arrayExp)
        if(toString.call(items) === "[object Array]"){
            this.reImplementForExp(items.length)
        }
    }
    AttachDom() {}
    Render(){
        this.dynamicVNodes.forEach(node=>{
            node.Render()
            if(node.Dom!=null)
                this.Parent.Dom.appendChild(node.Dom)
        })
    }
}