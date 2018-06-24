import { RegisterApp } from "../manager/app-manager";
import { AppOption, IAppMvvm } from "../models";
import { NewVNode, TraverseDom } from "../vdom/vdom";
import { VNode } from "../vnode/vnode";
import { FetchProperty } from "./property";



export function App(option:AppOption){
    checkAppOption(option)
    let res=FetchProperty()
    return function(target:IAppMvvm){
        let constructor= class $AppMvvm extends target{
            
            $InitFuncs:string[]=res.initFuncs
            $DestroyFuncs:string[]=res.destroyFuncs
            
            $initialize(){
                super.$initialize()
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
            $InitTreeroot(): VNode {
                let dom=document.querySelector(option.el)
                if(dom==null){
                    throw new Error("no specified element "+option.el)
                }
                let vdom=TraverseDom(dom)
                let vnode=NewVNode(vdom,this,null)
                return vnode
            }
            $InitNamespace(): string {
                return option.namespace
            }
            $InitDataItems(): {name:string,value:any}[] {
                let datas:{name:string,value:any}[]=[]
                res.datas.forEach(item=>{
                    datas.push({name:item,value:(this as any)[item]})
                })
                return datas
            }
            $InitComputeItems(): { name: string; get: () => any }[] {
                return res.computes
            }
            $InitEl(){
                return option.el
            }
            
        }
        RegisterApp(constructor)
    }
}
function checkAppOption(option:AppOption){
    option.namespace=option.namespace?option.namespace:"default"
}