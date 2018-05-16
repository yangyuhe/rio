import { GetComponent, IsComponentRegistered } from "../manager/components-manager";
import { MVVM } from "../mvvm/mvvm";
import { GetNS } from "../util";
import { NewVNode, VDom } from "../vdom/vdom";
import { TemplateNode } from "./template-node";
import { VNode } from "./vnode";
import { VNodeStatus } from "../const";

export class CustomNode extends VNode{
    
    constructor(public Vdom:VDom,public mvvm: MVVM,public Parent:VNode,public SurroundMvvm:MVVM) {
        super(Vdom,mvvm,Parent)
    }
    AddIns(name:string,exp:string){
        this.ins_exp[name]=exp
    }
    /**获取跟slot匹配的模版内容 */
    GetTemplate(name:string):TemplateNode{
        for(let i=0;i<this.Children.length;i++){
            let template=this.Children[i] as TemplateNode
            if(template.templatename==name)
                return template
        }
        return null
    }
    Render(): void {
        this.Dom=this.SurroundMvvm.Render()
        if(this.Dom && this.Parent && this.Parent.Dom)
            this.Parent.Dom.appendChild(this.Dom)
    }
    

    /**override vnode */
    protected childSet(){
        //制造中间节点管理template
        let defaultTemplate=new TemplateNode(this.Vdom,this.mvvm?this.mvvm:this.SurroundMvvm,this,"default")
        defaultTemplate.Parent=this
        let templates:{[name:string]:VNode}={"default":defaultTemplate}
        //解析子节点
        for (let i = 0; i < this.Vdom.Children.length; i++) {
            let childnode=this.Vdom.Children[i]

            let name=this.Vdom.GetAttr("slot")
            if(name==null || name==""){
                name="default"
            }
            if(templates[name]==null){
                templates[name]=new TemplateNode(this.Vdom,this.mvvm?this.mvvm:this.SurroundMvvm,this,name)
                templates[name].Parent=this
            }
            let vchild=NewVNode(childnode,templates[name].mvvm,templates[name])
            
            vchild.AttachDom()
            templates[name].Children.push(vchild)
        }
        for(let name in templates){
            this.Children.push(templates[name])
        }
    }
    
    ParseTemplate(){
        let domtree=this.SurroundMvvm.GetDomTree()
        let ns=GetNS(domtree.NodeName)

        if(IsComponentRegistered(ns.value,ns.namespace||this.SurroundMvvm.$Namespace)){
            let option=GetComponent(ns.value,ns.namespace||this.SurroundMvvm.$Namespace)
            let selfmvvm=new MVVM(option)
            let child= new CustomNode(domtree,this.SurroundMvvm,null,selfmvvm)
            this.SurroundMvvm.$TreeRoot=child
            selfmvvm.$FenceNode=this
            child.ParseTemplate()            
        }else{
            this.SurroundMvvm.$TreeRoot=new VNode(domtree,this.SurroundMvvm,null)
        }
        this.SurroundMvvm.$TreeRoot.AttachDom()
        
    }
    GetInValue(prop:string){
        if(this.ins_pure[prop]!=null)
            return this.ins_pure[prop]
        if(this.ins_exp[prop]!=null)
            return this.mvvm.GetExpValue(this.ins_exp[prop])
        return null
    }
    GetIn(prop:string){
        return this.ins_pure[prop] ||this.ins_exp[prop]
    }
    GetOut(prop:string){
        return this.outs[prop]
    }
    
    
    Refresh() {
        this.SurroundMvvm.$TreeRoot.Refresh()
    }
    Update(){
        this.SurroundMvvm.$TreeRoot.Update()
    }
    protected testOutput(name:string):boolean{
        if(this.SurroundMvvm.$Outs.indexOf(name)==-1)
            return false
        return true
    }
    protected testInput(name:string):boolean{
        return this.SurroundMvvm.$Ins.some(prop=>{
            return prop.name==name
        })
    }
    OnRemoved(){
        this.SurroundMvvm.$ondestroy()
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        this.SurroundMvvm.$TreeRoot.SetStatus(status)
    }

}