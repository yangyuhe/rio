import { GetInnerDir } from "../directive/inner-dir";
import { GetDirectiveCon, IsDirectiveRegistered } from '../manager/directive-manager';
import { DirectiveMVVM } from '../mvvm/directive-mvvm';
import { GetNS, InsertDomChild, StrToEvalstr } from '../util';
import { DomType, REG_IN, REG_OUT, REG_ATTR, PRE, ANCHOR } from './../const';
import { InnerDirective } from './../directive/inner-dir';
import { DirectiveNode } from './directive-node';
import { VNode } from './vnode';
import { VDom } from "../vdom/vdom";
import { Mvvm } from "../mvvm/mvvm";
import { DomStatus } from "../models";
export class VinallaNode extends VNode{
    
    private directives:DirectiveMVVM[]=[]
    private innerDirective:{dir:InnerDirective,exp:string,options:string[]}[]=[];
    
    private isAnchor:boolean=false;
    private anchorName:string="";

    /**普通属性 */
    protected attrs: { name: string, value: string }[] = [];
    
    constructor(public Vdom:VDom,public mvvm: Mvvm,public Parent:VNode){
        super(Vdom,mvvm,Parent);
        this.nodeValue = this.Vdom.NodeValue
        this.nodeName = this.Vdom.NodeName
        this.nodeType = this.Vdom.NodeType
        //保存元素属性
        let vanillaAttrs=this.Vdom.Attrs
        for (let i = 0; i < this.Vdom.Attrs.length; i++) {
            let attr=this.Vdom.Attrs[i]
            let ns=GetNS(attr.Name)
            if(ns.namespace==null)
                ns.namespace=this.mvvm.$InitNamespace()
            if(IsDirectiveRegistered(ns.value,ns.namespace)){
                let dirNode=new DirectiveNode(this.Vdom)
                let dirCons=GetDirectiveCon(ns.value,ns.namespace)
                let dirMvvm=new dirCons();
                dirMvvm.$Initialize(dirNode,this);
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
    
    
    Render() :DomStatus[]{
        if (this.nodeType == 1) {
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
            
            this.DomSet = [{type:DomType.NEW,dom:dom}] 
            
            this.Children.forEach(child => {
                let childdomset=child.Render();
                childdomset.forEach(childdom=>{
                    this.DomSet[0].dom.appendChild(childdom.dom)
                });
                childdomset.forEach(childom=>{
                    childom.type=DomType.CONSTANT
                });
            })
            this.directiveBind()
            return this.DomSet
        }
        if (this.nodeType == 3) {
            let dom = document.createTextNode(this.nodeValue)
            this.DomSet=[{type:DomType.NEW,dom:dom}]
            let evalexp=StrToEvalstr(this.nodeValue)
            if (!evalexp.isconst) {
                let watcher=this.mvvm.$CreateWatcher(this,evalexp.exp,(newvalue, oldvalue)=>{
                    dom.textContent = newvalue
                });
                dom.textContent=watcher.GetCurValue();
            }else{
                dom.textContent=evalexp.exp
            }
            return this.DomSet
        }
        if(this.nodeType==8){
            let dom=document.createComment(this.nodeValue)
            this.DomSet=[{type:DomType.NEW,dom: dom}]
            return this.DomSet
        }
    }
    Refresh() {
        this.DomSet.forEach(dom=>dom.type=DomType.CONSTANT);
        if(this.nodeType==1){
            let thedom=this.DomSet[0].dom
            let childdom:Node=null
            this.Children.forEach(child=>{
                child.DomSet.forEach(domstate=>{
                    if(domstate.type==DomType.CONSTANT){
                        childdom=domstate.dom
                        return
                    }
                    if(domstate.type==DomType.NEW){
                        InsertDomChild(thedom,domstate.dom,childdom)
                        childdom=domstate.dom
                        return
                    }
                    if(domstate.type==DomType.DELETE){
                        thedom.removeChild(domstate.dom)
                        return
                    }
                })
            })
        }
        this.Children.forEach(child=>child.Refresh())
    }
    Update(){
        //todo 更新属性
        if (this.nodeType == 1) {
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
        if (this.nodeType == 3) {
            let evalexp=StrToEvalstr(this.nodeValue)
            if (!evalexp.isconst) {
                this.DomSet[0].dom.textContent=this.mvvm.$GetExpOrFunValue(evalexp.exp)
            }else{
                this.DomSet[0].dom.textContent=evalexp.exp
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