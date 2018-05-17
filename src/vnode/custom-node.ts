import { VinallaNode } from './vinalla-node';
import { REG_IN, REG_OUT, VNodeStatus } from "../const";
import { GetComponent, IsComponentRegistered } from "../manager/components-manager";
import { MVVM } from "../mvvm/mvvm";
import { GetNS } from "../util";
import { NewVNode, VDom } from "../vdom/vdom";
import { TemplateNode } from "./template-node";
import { VNode } from "./vnode";

export class CustomNode extends VNode{
    //输入与输出值
    private ins_pure:{[name:string]:any}={}
    private ins_exp:{[name:string]:string}={}
    private outs:{[name:string]:string}={}

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
            this.SurroundMvvm.$TreeRoot=new VinallaNode(domtree,this.SurroundMvvm,null)
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

    OnRemoved(){
        this.SurroundMvvm.$ondestroy()
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        this.SurroundMvvm.$TreeRoot.SetStatus(status)
    }
    AddProperty(name: string, value: string) {
        //输入
        for(let i=0;i<this.SurroundMvvm.$Ins.length;i++){
            let prop=this.SurroundMvvm.$Ins[i]
            
            if(REG_IN.test(name) && prop.name==RegExp.$1){
                this.ins_exp[RegExp.$1]=value
                return
            }else{
                if(prop.name==name){
                    this.ins_pure[name]=value
                    return
                }
            }
        }
        //输出
        for(let i=0;i<this.SurroundMvvm.$Outs.length;i++){
            let event=this.SurroundMvvm.$Outs[i]
            
            if(REG_OUT.test(name) && event==RegExp.$1){
                this.outs[RegExp.$1]=value
                return
            }
        }
        
        super.AddProperty(name,value)
    }
    
}