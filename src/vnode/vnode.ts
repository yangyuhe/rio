import { DomStatus } from './../models';
import { Mvvm } from '../mvvm/mvvm';
import { NewVNode, VDom } from '../vdom/vdom';
import { DomType, VNodeStatus } from './../const';
import { AppMvvm } from './../mvvm/app-mvvm';
import { ComponentMvvm } from './../mvvm/component-mvvm';
export abstract class VNode {
    protected nodeValue: string
    protected nodeName: string
    protected nodeType: number
    /**普通属性 */
    protected attrs: { name: string, value: string }[] = []
    
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
    Rerender():void{
        this.DomSet=this.DomSet.filter(dom=>dom.type!=DomType.DELETE)
        this.Children.forEach(child=>child.Rerender())
    }
    

    abstract Update():void;
    
    
    OnRemoved(){
        this.Children.forEach(child=>{
            child.OnRemoved()
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
    NavigateTo(url:string):void{
        if(this.mvvm.$IsRoot()){
            (this.mvvm as AppMvvm).$NavigateTo(url)
        }else{
            if(this.Parent!=null)
                this.Parent.NavigateTo(url);
            else{
                (<ComponentMvvm>this.mvvm).$GetFenceNode().NavigateTo(url);
            }
        }
    }
    GetNodeName(){
        return this.nodeName.toLowerCase()
    }
}