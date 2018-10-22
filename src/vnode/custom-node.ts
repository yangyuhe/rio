import { VNodeStatus } from "../const";
import { GetInnerDir } from '../directive/inner-dir';
import { DomStatus } from '../models';
import { Mvvm } from "../mvvm/mvvm";
import { CustDom } from "../vdom/parser";
import { NewVNode } from "../vdom/vdom";
import { PRE } from '../const';
import { ComponentMvvm } from '../mvvm/component-mvvm';
import { PlugNode } from "./plug-node";
import { VNode } from "./vnode";

export class CustomNode extends VNode{
    

    /**获取自定义组建上的style 或者r-style属性 */
    private styles:{[key:string]:string}={};
    /**获取自定义组建上的class 或者r-class属性 */
    private classes:{[key:string]:string}={};

    constructor(public Vdom:CustDom,public mvvm: Mvvm,public Parent:VNode,public SurroundMvvm:ComponentMvvm) {
        super(Vdom,mvvm,Parent)
        if(this.Vdom){
            for (let i = 0; i < this.Vdom.Attrs.length; i++) {
                let name=this.Vdom.Attrs[i].Name;
                let value=this.Vdom.Attrs[i].Value;
                //是否是样式
                if(name=="style" ||name==PRE+"style"){
                    this.styles[name]=value;
                    continue;
                }
                if(name=="class"||name==PRE+"class"){
                    this.classes[name]=value;
                    continue;
                }
            }
        }
        
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
        let dom=this.SurroundMvvm.$Render();
        this.statefulDom=[dom];
        
        if(this.styles['style']!=null){
            let exp=this.styles['style'];
            let styleitems=exp.split(";");
            styleitems.forEach(item=>{
                let kv=item.split(":");
                ((dom.dom as HTMLElement).style as any)[kv[0]]=kv[1];
            });
        }
        if(this.styles[PRE+'style']!=null){
            let styledir=GetInnerDir(PRE+"style");
            let exp=this.styles[PRE+'style'];
            styledir(exp,this);
        }
        if(this.classes['class']!=null){
            let classitem=this.classes['class'].split(/\s+/);
            (dom.dom as HTMLElement).classList.add(...classitem);
        }
        if(this.classes[PRE+"class"]!=null){
            let classdir=GetInnerDir(PRE+'class');
            let exp=this.classes[PRE+'class'];
            classdir(exp,this);
        }
        return this.statefulDom
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
    
    
    Refresh() {
        this.SurroundMvvm.$Refresh()
    }
    Update(){
        this.SurroundMvvm.$Update()
    }

    OnDestroy(){
        this.SurroundMvvm.$OnDestroy()
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        this.SurroundMvvm.$SetStatus(status)
    }
    Reflow(){
    }
    OnRouterChange(){
        this.SurroundMvvm.$OnRouterChange();
    }
    OnMount(){
        super.OnMount();
        this.SurroundMvvm.$OnMount();
    }
    OnNextTick(){
        super.OnNextTick();
        this.SurroundMvvm.$NoticeNextTickListener();
    }
}