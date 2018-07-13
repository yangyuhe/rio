import { Mvvm } from '../mvvm/mvvm';
import { NewVNode, VDom } from '../vdom/vdom';
import { DomType, VNodeStatus } from './../const';
import { DomStatus } from './../models';
import { VinallaNode } from './vinalla-node';
export abstract class VNode {
    //元素值 只有当nodeType为3时才有用，其他时候为null
    protected nodeValue: string
    //元素名称 都是小写字母
    protected nodeName: string
    //元素类型：1 元素 3 文本 8 注释
    protected nodeType: number
    
    
    Children: VNode[] = []
    DomSet: {type:DomType,dom:Node}[]=[]

    
    protected status:VNodeStatus=VNodeStatus.ACTIVE

    constructor(public Vdom:VDom,public mvvm: Mvvm,public Parent:VNode) {
        if(this.Vdom!=null){
            this.nodeValue = this.Vdom.NodeValue
            this.nodeName = this.Vdom.NodeName
            this.nodeType = this.Vdom.NodeType
        }
    }


    abstract Render():DomStatus[];

    Reflow(){
        this.DomSet=[];
        this.Children.forEach(child=>{
            this.DomSet=this.DomSet.concat(child.DomSet)
        });
        if(this.Parent!=null)
            this.Parent.Reflow()
    }
    Refresh():void{
        this.DomSet=this.DomSet.filter(dom=>dom.type!=DomType.DELETE)
        this.Children.forEach(child=>child.Refresh())
    }
    

    abstract Update():void;
    
    
    OnDestroy(){
        this.Children.forEach(child=>{
            child.OnDestroy()
        })
    }
    
    AttachChildren() {
        //解析子节点
        for (let i = 0; i < this.Vdom.Children.length; i++) {
            let childdom=this.Vdom.Children[i]
            let vchild=NewVNode(childdom,this.mvvm,this)
            
            if(vchild!=null){
                vchild.AttachChildren()
                this.Children.push(vchild)
            }
        }
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        this.Children.forEach(child=>{
            child.SetStatus(status)
        })
    }
    GetStatus(){
        return this.status
    }
    OnRouterChange(){
        this.Children.forEach(child=>child.OnRouterChange())
    }
    GetNodeName(){
        return this.nodeName.toLowerCase()
    }
    GetAnchor(name:string):VinallaNode{
        for(let i=0;i<this.Children.length;i++){
            let anchor=this.Children[i].GetAnchor(name);
            if(anchor!=null)
                return anchor;
        }
        return null;
    }
}