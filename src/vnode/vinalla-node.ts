import { GetInnerDir } from "../directive/inner-dir";
import { GetDirectiveCon, IsDirectiveRegistered } from '../manager/directive-manager';
import { DirectiveMVVM } from '../mvvm/directive-mvvm';
import { GetNS } from '../util';
import { REG_ATTR, REG_IN, REG_OUT } from './../const';
import { InnerDirective } from './../directive/inner-dir';
import { DirectiveNode } from './directive-node';
import { VNode } from './vnode';
export class VinallaNode extends VNode{
    
    private directives:DirectiveMVVM[]=[]
    private innerDirective:{dir:InnerDirective,isconst:boolean,exp:string}[]=[]
    
    AddProperty(name: string, value: string) {
        if(REG_ATTR.test(name)){
            this.Attrs.push({name:name,value:value})
        }
    }
    
    OnRemoved(){
        super.OnRemoved()
        this.directives.forEach(dir=>dir.$OnDestroy())
    }

    protected directiveBind(){
        this.directives.forEach(dir=>dir.$Render())
        this.innerDirective.forEach(item=>{
            item.dir(item.exp,this,item.isconst)
        })
    }
    
    /**解析基本信息 */
    protected basicSet(){
        this.NodeValue = this.Vdom.NodeValue
        this.NodeName = this.Vdom.NodeName
        this.NodeType = this.Vdom.NodeType
        //保存元素属性
        let vanillaAttrs=this.Vdom.Attrs
        for (let i = 0; i < this.Vdom.Attrs.length; i++) {
            let attr=this.Vdom.Attrs[i]
            let ns=GetNS(attr.Name)
            if(ns.namespace==null)
                ns.namespace=this.mvvm.$GetNamespace()
            if(IsDirectiveRegistered(ns.value,ns.namespace)){
                let dirNode=new DirectiveNode(this.Vdom)
                let dirCons=GetDirectiveCon(ns.value,ns.namespace)
                let dirMvvm=new dirCons(dirNode,this)
                vanillaAttrs=vanillaAttrs.filter(attr=>{
                    let name=attr.Name
                    if(REG_IN.test(attr.Name) || REG_OUT.test(attr.Name))
                        name=RegExp.$1
                    
                    let isprop= dirMvvm.$Ins.some(prop=>prop.name==name)
                    let isevent=dirMvvm.$Outs.some(event=>event==name)
                    return !(isprop || isevent)
                })
                this.directives.push(dirMvvm)
                return
            }
        }
        vanillaAttrs= vanillaAttrs.filter(attr=>{
            if(REG_IN.test(attr.Name)){
                let dir=GetInnerDir(RegExp.$1)
                if(dir!=null){
                    this.innerDirective.push({dir:dir,isconst:false,exp:attr.Value})
                    return false
                }
            }
            let dir=GetInnerDir(attr.Name)
            if(dir!=null){
                this.innerDirective.push({dir:dir,isconst:true,exp:attr.Value})
                return false
            }
            return true
        })
        vanillaAttrs.forEach(attr=>{
            this.AddProperty(attr.Name,attr.Value)
        })
    }
}