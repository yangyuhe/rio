import { IComponentMvvm } from './../models';
import { RegisterComponent, GetDomTree } from '../manager/components-manager';
import { ComponentOption, Prop } from '../models';
import { FetchProperty } from './property';
import { VNode } from '../vnode/vnode';
import { NewVNode } from '../vdom/vdom';



export function Component(option:ComponentOption){
    checkComponentOption(option)
    let res=FetchProperty()
    return function(target:IComponentMvvm){
        let constructor= class $ComponentMvvm extends target{
            $InitFuncs:string[]=res.initFuncs
            $DestroyFuncs:string[]=res.destroyFuncs
            constructor(){
                super()
                this.$InitFuncs.forEach(init=>{
                    (this as any)[init].call(this)
                })
            }
            $OnDestroy(){
                super.$OnDestroy()
                this.$DestroyFuncs.forEach(destroy=>{
                    (this as any)[destroy].call(this)
                })
            }
            $GetTreeroot():VNode{
                let domtree=GetDomTree(this.$GetName(),this.$GetNamespace())
                if(domtree==null){
                    throw new Error("not found template or templateUrl for component "+this.$GetName()+" in "+this.$GetNamespace())
                }
                let vnode=NewVNode(domtree,this,null)
                return vnode
            }
            $GetNamespace(): string {
                return option.namespace
            }
            $GetDataItems(): {name:string,value:any}[] {
                let datas:{name:string,value:any}[]=[]
                res.datas.forEach(item=>{
                    datas.push({name:item,value:(this as any)[item]})
                })
                return datas
            }
            $GetComputeItems(): { name: string; get: () => any }[] {
                return res.computes
            }
            $GetName():string{
                return option.name
            }
            $GetIns():Prop[]{
                return res.props
            }
            $GetOuts():string[]{
                //todo
                return []
            }
            $GetParams(){
                return res.params
            }
        }
        RegisterComponent(option.name,option.namespace,constructor,option)
    }
}


function checkComponentOption(option:ComponentOption){
    option.namespace=option.namespace?option.namespace:"default"
    option.events=option.events?option.events:[]
}

