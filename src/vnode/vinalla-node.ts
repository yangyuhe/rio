import { GetDirective, IsDirectiveRegistered } from '../manager/directive-manager';
import { DirectiveMVVM } from '../mvvm/directive-mvvm';
import { GetNS } from '../util';
import { REG_ATTR, REG_IN, REG_OUT, PRE } from './../const';
import { Directive } from './directive';
import { VNode } from './vnode';
import { DirModel } from '../directive/model';
import { OnClick } from '../directive/onclick';
export class VinallaNode extends VNode{
    
    private directives:DirectiveMVVM[]=[]
    private innerDirective:{name:string,value:string}[]=[]
    
    AddProperty(name: string, value: string) {
        if(REG_ATTR.test(name)){
            this.Attrs.push({name:name,value:value})
        }
    }
    
    OnRemoved(){
        super.OnRemoved()
        this.directives.forEach(dir=>dir.$ondestroy())
    }

    protected directiveBind(){
        this.directives.forEach(dir=>dir.Render())
        this.innerDirective.forEach(dir=>{
            if(dir.name==PRE+"model"){
                DirModel(dir.value,this)
            }
            if(dir.name==PRE+"click"){
                OnClick(dir.value,this)
            }
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
                ns.namespace=this.mvvm.$Namespace
            if(IsDirectiveRegistered(ns.value,ns.namespace)){
                let directiveoption=GetDirective(ns.value,ns.namespace)
                vanillaAttrs=vanillaAttrs.filter(attr=>{
                    let name=attr.Name
                    if(REG_IN.test(attr.Name) || REG_OUT.test(attr.Name))
                        name=RegExp.$1
                    
                    let isprop= directiveoption.props.some(prop=>prop.name==name)
                    let isevent=directiveoption.events.some(event=>event==name)
                    return !(isprop || isevent)
                })
                let directive=new Directive(this.Vdom,directiveoption)
                let directivemvvm=new DirectiveMVVM(directiveoption,directive,this)
                this.directives.push(directivemvvm)
                return
            }
        }
        vanillaAttrs= vanillaAttrs.filter(attr=>{
            if(attr.Name==PRE+"model"){
                this.innerDirective.push({name:attr.Name,value:attr.Value})
                return false
            }
            if(attr.Name==PRE+"click"){
                this.innerDirective.push({name:attr.Name,value:attr.Value})
                return false
            }
            return true
        })
        vanillaAttrs.forEach(attr=>{
            this.AddProperty(attr.Name,attr.Value)
        })
    }
}