import { ANCHOR, DomType, PRE, REG_ATTR, REG_IN, REG_OUT } from '../const';
import { GetInnerDir, InnerDirective } from "../directive/inner-dir";
import { GetDirectiveCon, IsDirectiveRegistered } from '../manager/directive-manager';
import { DomStatus } from "../models";
import { DirectiveMVVM } from '../mvvm/directive-mvvm';
import { Mvvm } from "../mvvm/mvvm";
import { GetNS, InsertDomChild, StrToEvalstr } from '../util';
import { CustDom } from "../vdom/parser";
import { VNode } from './vnode';
export class VinallaNode extends VNode{
    
    private directives:DirectiveMVVM[]=[]
    private innerDirective:{dir:InnerDirective,exp:string,options:string[]}[]=[];
    
    private isAnchor:boolean=false;
    private anchorName:string="";

    /**普通属性 */
    protected attrs: { name: string, value: string }[] = [];
    
    constructor(public Vdom:CustDom,public mvvm: Mvvm,public Parent:VNode){
        super(Vdom,mvvm,Parent);
        this.nodeValue = this.Vdom.Text
        this.nodeName = this.Vdom.Name
        this.nodeType = this.Vdom.Type
        //保存元素属性
        let vanillaAttrs=this.Vdom.Attrs
        for (let i = 0; i < this.Vdom.Attrs.length; i++) {
            let attr=this.Vdom.Attrs[i]
            let ns=GetNS(attr.Name)
            if(ns.namespace==null)
                ns.namespace=this.mvvm.$InitNamespace()
            if(IsDirectiveRegistered(ns.value,ns.namespace)){
                let dirCons=GetDirectiveCon(ns.value,ns.namespace)
                let dirMvvm=new dirCons();
                dirMvvm.$Initialize(this);
                vanillaAttrs=vanillaAttrs.filter(attr=>{
                    let name=attr.Name
                    if(REG_IN.test(attr.Name) || REG_OUT.test(attr.Name))
                        name=RegExp.$1
                    
                    let isprop= dirMvvm.$Ins.some(prop=>prop.name==name)
                    let isevent=dirMvvm.$Outs.some(event=>event==name)
                    return !(isprop || isevent)
                })
                this.directives.push(dirMvvm)
            }
        }
        vanillaAttrs= vanillaAttrs.filter(attr=>{
            let slice=attr.Name.split(":");
            let dir=GetInnerDir(slice[0]);
            if(dir!=null){
                this.innerDirective.push({dir:dir,exp:attr.Value,options:slice.slice(1)})
                return false
            }
            return true
        })
        vanillaAttrs.forEach(attr=>{
            if(REG_ATTR.test(attr.Name)){
                this.attrs.push({name:attr.Name,value:attr.Value});
                if(attr.Name==PRE+ANCHOR){
                    this.isAnchor=true;
                    this.anchorName=attr.Value;
                }
            }
        })
    }

    OnDestroy(){
        super.OnDestroy()
        this.directives.forEach(dir=>dir.$OnDestroy())
    }

    protected directiveBind(){
        this.directives.forEach(dir=>dir.$Render())
        this.innerDirective.forEach(item=>{
            item.dir(item.exp,this,item.options)
        })
    }
    
    /**先渲染自己，再渲染孩子并把孩子返回的dom添加到自己的dom的孩子中 */
    Render() :DomStatus[]{
        if (this.nodeType == "element") {
            let dom = document.createElement(this.nodeName)
            this.attrs.forEach(prop => {
                let evalexp=StrToEvalstr(prop.value);
                if (!evalexp.isconst) {
                    let watcher=this.mvvm.$CreateWatcher(this,evalexp.exp,(newvalue, oldvalue)=>{
                        dom.setAttribute(prop.name, newvalue);
                    });
                    let value=watcher.GetCurValue();
                    if(prop.name=='src' && this.nodeName=='img')
                        (dom as HTMLImageElement).src=value;
                    else
                        dom.setAttribute(prop.name, value);
                }else{
                    dom.setAttribute(prop.name, evalexp.exp);
                }
                
            })
            
            this.statefulDom = [{type:DomType.NEW,dom:dom}] 
            
            this.Children.forEach(child => {
                let childdomset=child.Render();
                childdomset.forEach(childdom=>{
                    this.statefulDom[0].dom.appendChild(childdom.dom)
                });
                childdomset.forEach(childom=>{
                    childom.type=DomType.CONSTANT
                });
            })
            this.directiveBind()
            return this.statefulDom
        }
        if (this.nodeType == "text") {
            let dom = document.createTextNode(this.nodeValue)
            this.statefulDom=[{type:DomType.NEW,dom:dom}]
            let evalexp=StrToEvalstr(this.nodeValue)
            if (!evalexp.isconst) {
                let watcher=this.mvvm.$CreateWatcher(this,evalexp.exp,(newvalue, oldvalue)=>{
                    dom.textContent = newvalue
                });
                dom.textContent=watcher.GetCurValue();
            }else{
                dom.textContent=evalexp.exp
            }
            return this.statefulDom
        }
        if(this.nodeType=="comment"){
            let dom=document.createComment(this.nodeValue)
            this.statefulDom=[{type:DomType.NEW,dom: dom}]
            return this.statefulDom
        }
    }
    /**根据孩子节点的dom状态刷新自己的dom节点 */
    Refresh() {
        this.statefulDom.forEach(dom=>dom.type=DomType.CONSTANT);
        if(this.nodeType=="element"){
            let parentDom=this.statefulDom[0].dom
            let cursorDom:Node=null
            this.Children.forEach(child=>{
                child.statefulDom.forEach(statefulDom=>{
                    if(statefulDom.type==DomType.CONSTANT){
                        cursorDom=statefulDom.dom
                        return
                    }
                    if(statefulDom.type==DomType.NEW){
                        InsertDomChild(parentDom,statefulDom.dom,cursorDom)
                        cursorDom=statefulDom.dom
                        return
                    }
                    if(statefulDom.type==DomType.DELETE){
                        parentDom.removeChild(statefulDom.dom)
                        return
                    }
                })
            })
        }
        this.Children.forEach(child=>child.Refresh())
    }
    Update(){
        //todo 更新属性
        if (this.nodeType == "element") {
            let children: VNode[] = []
            this.Children.forEach(child => {
                children.push(child)
            })
            children.forEach(child => {
                child.Update()
            })
            //todo 设置属性
            return
        }
        if (this.nodeType == "text") {
            let evalexp=StrToEvalstr(this.nodeValue)
            if (!evalexp.isconst) {
                this.statefulDom[0].dom.textContent=this.mvvm.$GetExpOrFunValue(evalexp.exp)
            }else{
                this.statefulDom[0].dom.textContent=evalexp.exp
            }
        }
    }
    Reflow(){
    }
    GetAnchor(name:string):VinallaNode{
        if(this.isAnchor && this.anchorName==name){
            return this;
        }
        return super.GetAnchor(name);
    }
}