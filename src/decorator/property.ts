import { ParamType, Prop } from './../models';
let datas:string[]=[]
let computes:{name:string,get:()=>any}[]=[]
let props:Prop[]=[]
let initFuncs:string[]=[];
let mountFuncs:string[]=[];
let destroyFuncs:string[]=[]



export function Reactive(target:any,key:string){
    datas.push(key)
}
export function Computed(target:any,key:string,descriptor:PropertyDescriptor){
    computes.push({name:key,get:(descriptor as any).get})
}
export function Prop(name:string,required:boolean,type?:ParamType){
    return function(target:any,key:string){
        props.push({
            name:name,
            required:required,
            type:type,
            origin:key
        })
    }
}

export function OnInit(target:any,key:string,descriptor:PropertyDescriptor){
    initFuncs.push(key)
}
export function OnMount(target:any,key:string,descriptor:PropertyDescriptor){
    mountFuncs.push(key)
}
export function OnDestroy(target:any,key:string,descriptor:PropertyDescriptor){
    destroyFuncs.push(key)
}



export function FetchProperty(){
    let res={
        computes:computes,
        props:props,
        initFuncs:initFuncs,
        mountFuncs:mountFuncs,
        destroyFuncs:destroyFuncs,
        datas:datas
    }
    computes=[]
    props=[]
    initFuncs=[];
    mountFuncs=[];
    destroyFuncs=[]
    datas=[]
    return res
}