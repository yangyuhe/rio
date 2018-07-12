import { DomType } from './const';
import { AppMvvm } from './mvvm/app-mvvm';
import { ComponentMvvm } from './mvvm/component-mvvm';
import { DirectiveMVVM } from './mvvm/directive-mvvm';
import { VDom } from './vdom/vdom';

interface BaseOption{
    namespace?:string,
}
export interface ComponentOption extends BaseOption{
    events?:Event[],
    name:string,
    template?:string,
    templateUrl?:string,
    style?:string,
    styleUrl?:string
    
}
export interface AppOption extends BaseOption{
    el:string
}
export interface DirectiveOption extends BaseOption{
    name:string
    events?:string[]
}

export type ParamType="array"|"object"|"number"|"string"|"boolean"
export interface Prop{
    name:string
    origin:string
    required:boolean
    type?:ParamType
}
export interface Event{
    name:string,
    paramsType:ParamType[]
}
export interface OnDataChange {
    (newvalue:any,oldvalue:any):void
}
/**for语句 */
export class ForExp{
    constructor(public itemExp:string,public arrayExp:string){}
}



export interface IComponentMvvm{
    new ():ComponentMvvm
}
export interface IAppMvvm{
    new ():AppMvvm
}
export interface IDirectiveConstructor{
    new ():DirectiveMVVM
}
export interface ComponentMvvmFactoryOption {
    $constructor:IComponentMvvm
    $preProcess:boolean
    $id:string,
    $domtree:VDom,
    $origin:ComponentOption
}
export interface RouterInfo{
    path:string,
    params:{
        name:string,
        value:string
    }[],
    getParam(name:string):string
}
export interface RouterState{
    active:RouterInfo,
    cur:RouterInfo
}
export type RouterChangeCallback=(newrouter:RouterInfo,oldrouter:RouterInfo)=>void

export interface DomStatus{
    dom:Node,
    type:DomType
}