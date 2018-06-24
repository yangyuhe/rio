import { AppMvvm } from './mvvm/app-mvvm';
import { NewVNode, TraverseDom } from './vdom/vdom';
import { VNode } from './vnode/vnode';

interface BaseOption{
    data?:{[key:string]:object},
    methods?:{[key:string]:Function},
    computed?:{[key:string]:()=>any}
}
interface AppOption extends BaseOption{
    namespace?:string,
    el:string
}
interface ComponentOption extends BaseOption{
    namespace?:string,
    events?:string[],
    name:string,
    template?:string,
    templateUrl?:string,
    style?:string,
    styleUrl?:string
}
function Rio(option:AppOption){
    checkAppOption(option)
    let constructor= class $AppMvvm extends AppMvvm{
        constructor(){
            super()
            if(option.methods.OnInit!=null){
                option.methods.OnInit()
            }
        }
        protected $initData(){
            let data=JSON.parse(JSON.stringify(option.data))
            for(let key in data){
                (this as any)[key]=data[key]
            }
        }
        $OnDestroy(){
            super.$OnDestroy()
            if(option.methods.OnDestroy!=null){
                option.methods.OnDestroy()
            }
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
            let dataitems:{name:string,value:any}[]=[]
            Object.keys(option.data).forEach(key=>dataitems.push({name:key,value:option.data[key]}))
            return dataitems
        }
        $InitComputeItems(): { name: string; get: () => any }[] {
            let computes:{ name: string; get: () => any }[]=[]
            for(let key in option.computed){
                computes.push({name:key,get:option.computed[key]})
            }
            return computes
        }
        
        $InitEl():string{
            return option.el
        }
    }
    return constructor
}
function checkAppOption(option:AppOption){
    if(option.el==null)
        throw new Error("el attribute should not be null")
    option.namespace=option.namespace?option.namespace:"default"
    option.methods=option.methods?option.methods:{}
    option.computed=option.computed?option.computed:{}
    option.data=option.data?option.data:{}
}
(Rio as any).component=function(option:ComponentOption){

}

