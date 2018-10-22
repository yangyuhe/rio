import { Mvvm } from '../mvvm/mvvm';
import { NewVNode } from '../vdom/vdom';
import { DomType, VNodeStatus } from '../const';
import { DomStatus } from '../models';
import { VinallaNode } from './vinalla-node';
import { CustDom } from '../vdom/parser';
import { IONode } from './io-node';
export abstract class VNode extends IONode{
    //元素值 只有当nodeType为text时才有用，其他时候为null
    protected nodeValue: string
    //元素名称 都是小写字母
    protected nodeName: string

    protected nodeType: "element"|"text"|"comment"
    
    
    Children: VNode[] = []
    statefulDom: {type:DomType,dom:Node}[]=[]

    
    protected status:VNodeStatus=VNodeStatus.ACTIVE

    constructor(public Vdom:CustDom,public mvvm: Mvvm,public Parent:VNode) {
        super(Vdom);
        if(this.Vdom!=null){
            this.nodeValue = this.Vdom.Text
            this.nodeName = this.Vdom.Name
            this.nodeType = this.Vdom.Type
        }
    }


    abstract Render():DomStatus[];

    Reflow(){
        this.statefulDom=[];
        this.Children.forEach(child=>{
            this.statefulDom=this.statefulDom.concat(child.statefulDom)
        });
        if(this.Parent!=null)
            this.Parent.Reflow()
    }
    Refresh():void{
        this.statefulDom=this.statefulDom.filter(dom=>dom.type!=DomType.DELETE)
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
    OnMount(){
        this.Children.forEach(child=>{
            child.OnMount();
        });
    }
    OnNextTick(){
        this.Children.forEach(child=>{
            child.OnNextTick();
        });
    }
}