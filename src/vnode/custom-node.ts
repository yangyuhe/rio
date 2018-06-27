import { REG_IN, REG_OUT, VNodeStatus } from "../const";
import { DomStatus } from '../models';
import { Mvvm } from "../mvvm/mvvm";
import { NewVNode, VDom } from "../vdom/vdom";
import { ComponentMvvm } from './../mvvm/component-mvvm';
import { PlugNode } from "./plug-node";
import { VNode } from "./vnode";

export class CustomNode extends VNode{
    //输入与输出值
    private ins_pure:{[name:string]:any}={}
    private ins_exp:{[name:string]:string}={}
    private outs:{[name:string]:string}={}

    constructor(public Vdom:VDom,public mvvm: Mvvm,public Parent:VNode,public SurroundMvvm:ComponentMvvm) {
        super(Vdom,mvvm,Parent)
        if(this.Vdom){
            for (let i = 0; i < this.Vdom.Attrs.length; i++) {
                let name=this.Vdom.Attrs[i].Name;
                let value=this.Vdom.Attrs[i].Value;
                //输入
                let ins=this.SurroundMvvm.$InitIns()
                for(let i=0;i<ins.length;i++){
                    let prop=ins[i]
                    
                    if(REG_IN.test(name) && prop.name==RegExp.$1){
                        this.ins_exp[RegExp.$1]=value
                        break
                    }else{
                        if(prop.name==name){
                            this.ins_pure[name]=value
                            break
                        }
                    }
                }
                //输出
                let outs=this.SurroundMvvm.$InitOuts()
                for(let i=0;i<outs.length;i++){
                    let event=outs[i]
                    
                    if(REG_OUT.test(name) && event.name==RegExp.$1){
                        this.outs[RegExp.$1]=value
                        break
                    }
                }
            }
        }
        
    }
    AddIns(name:string,exp:string){
        this.ins_exp[name]=exp
    }
    /**获取跟slot匹配的模版内容 */
    GetTemplate(name:string):PlugNode{
        for(let i=0;i<this.Children.length;i++){
            let template=this.Children[i] as PlugNode
            if(template.templatename==name)
                return template
        }
        return null
    }
    Render(): DomStatus[] {
        let doms=this.SurroundMvvm.$Render()
        this.DomSet=[doms]
        return this.DomSet
    }
    
    AttachChildren(){
        if(this.Vdom!=null){
            //制造中间节点管理template
            let defaultTemplate=new PlugNode(null,this.mvvm,null,"default")
            let templates:{[name:string]:VNode}={"default":defaultTemplate}
            //解析子节点
            for (let i = 0; i < this.Vdom.Children.length; i++) {
                let childnode=this.Vdom.Children[i]

                let name=childnode.GetAttr("slot")
                if(name==null || name==""){
                    name="default"
                }
                if(templates[name]==null){
                    templates[name]=new PlugNode(null,this.mvvm,null,name)
                }
                let vchild=NewVNode(childnode,templates[name].mvvm,templates[name])
                
                vchild.AttachChildren()
                templates[name].Children.push(vchild)
            }
            for(let name in templates){
                this.Children.push(templates[name])
            }
        }
    }

    GetInValue(prop:string){
        if(this.ins_pure[prop]!=null)
            return this.ins_pure[prop]
        if(this.ins_exp[prop]!=null)
            return this.mvvm.$GetExpOrFunValue(this.ins_exp[prop])
        return null
    }
    GetIn(prop:string){
        if(this.ins_pure[prop]!=null)
            return {value:this.ins_pure[prop],const:true} 
        if(this.ins_exp[prop]!=null)
            return {value:this.ins_exp[prop],const:false}
        return null
    }
    GetOut(prop:string){
        return this.outs[prop]
    }
    
    
    Rerender() {
        this.SurroundMvvm.$Refresh()
    }
    Update(){
        this.SurroundMvvm.$Update()
    }

    OnRemoved(){
        this.SurroundMvvm.$OnDestroy()
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        this.SurroundMvvm.$SetStatus(status)
    }
    Reflow(){
    }
}