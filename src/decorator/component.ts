import { GetDomTree, RegisterComponent, InitComponent, ComponentAutoId } from '../manager/components-manager';
import { ComponentOption, Prop } from '../models';
import { NewVNode } from '../vdom/vdom';
import { VNode } from '../vnode/vnode';
import { DomStatus, Event, IComponentMvvm } from './../models';
import { FetchProperty } from './property';



export function Component(option:ComponentOption){
    checkComponentOption(option)
    let res=FetchProperty()
    return function(target:IComponentMvvm){
        let constructor= class $ComponentMvvm extends target{
            $InitFuncs:string[]=res.initFuncs
            $MountFuncs:string[]=res.mountFuncs
            $DestroyFuncs:string[]=res.destroyFuncs
            $initialize(){
                super.$initialize()
                this.$InitFuncs.forEach(init=>{
                    (this as any)[init].call(this)
                })
            }
            $Render():DomStatus{
                let domstatus=super.$Render();
                this.$MountFuncs.forEach(func=>{
                    (this as any)[func].call(this)
                });
                return domstatus;
            }
            $OnDestroy(){
                super.$OnDestroy()
                this.$DestroyFuncs.forEach(destroy=>{
                    (this as any)[destroy].call(this)
                })
            }
            $InitTreeroot():VNode{
                //以防页面组件未初始化
                InitComponent(this.$InitName(),this.$InitNamespace());

                let domtree=GetDomTree(this.$InitName(),this.$InitNamespace())
                if(domtree==null){
                    throw new Error("not found template or templateUrl for component "+this.$InitName()+" in "+this.$InitNamespace())
                }
                
                let vnode=NewVNode(domtree,this,null)
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
            $InitName():string{
                return option.name
            }
            $InitIns():Prop[]{
                return res.props
            }
            $InitOuts():Event[]{
                return option.events
            }
        }
        if(option.name==null)
            option.name=target.name.toLowerCase()+ComponentAutoId();
        RegisterComponent(option.name,option.namespace,constructor,option);
        return (constructor as any);
    }
}


function checkComponentOption(option:ComponentOption){
    option.namespace=option.namespace?option.namespace:"default"
    option.events=option.events?option.events:[]
}

