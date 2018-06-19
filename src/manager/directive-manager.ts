import { IDirectiveConstructor } from "../models";
import { Id } from "./components-manager";

let repository:{[id:string]:IDirectiveConstructor}={}

export function RegisterDirective(name:string,namespace:string,constructor:IDirectiveConstructor){
    if(repository[Id(namespace,name)]!=null)
        throw new Error("directive "+Id(namespace,name)+" already exists")
    repository[Id(namespace,name)]=constructor
}
export function GetDirectiveCon(name:string,namespace:string):IDirectiveConstructor{
    name=name.toLowerCase()
    namespace=namespace.toLowerCase()
    let constructor=repository[Id(namespace,name)]
    return constructor
}
export function IsDirectiveRegistered(name:string,namespace:string){
    name=name.toLowerCase()
    namespace=namespace.toLowerCase()
    if(repository[Id(namespace,name)]!=null)
        return true
    else
        return false
}
