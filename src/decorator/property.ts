import { Prop, PropType } from './../models';
let datas:string[]=[]
let computes:{name:string,get:()=>any}[]=[]
let props:Prop[]=[]
let initFuncs:string[]=[]
let destroyFuncs:string[]=[]
let params:{alias:string,name:string,required:boolean}[]=[]



export function Data(target:any,key:string){
    datas.push(key)
}
export function Computed(target:any,key:string,descriptor:PropertyDescriptor){
    computes.push({name:key,get:(descriptor as any).get})
}
export function Prop(name:string,required:boolean,type?:PropType){
    props.push({
        name:name,
        required:required,
        type:type
    })
    return function(target:any,key:string){}
}
export function OnInit(target:any,key:string,descriptor:PropertyDescriptor){
    initFuncs.push(key)
}
export function OnDestroy(target:any,key:string,descriptor:PropertyDescriptor){
    destroyFuncs.push(key)
}
export function Param(name:string,required:boolean){
    return function(target:any,key:string){
        params.push({alias:key,name:name,required:required})
    }
}


export function FetchProperty(){
    let res={
        computes:computes,
        props:props,
        initFuncs:initFuncs,
        destroyFuncs:destroyFuncs,
        datas:datas,
        params:params
    }
    computes=[]
    props=[]
    initFuncs=[]
    destroyFuncs=[]
    datas=[]
    params=[]
    return res
}