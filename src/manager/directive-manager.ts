import { DirectiveOption } from "../models";
import { IsStringEmpty } from "../util";

let namespaces:{[namespace:string]:{[directive:string]:DirectiveOption}}={
    "default":{
    }
}

export function RegisterDirective(option:DirectiveOption){
    checkOption(option)
    option.data=option.data||{}
    option.events=option.events||[]
    option.methods=option.methods||{}
    option.props=option.props||[]
    if(namespaces[option.$namespace]==null)
        namespaces[option.$namespace]={}
    let directives=namespaces[option.$namespace]
    directives[option.$name]=option
}
export function GetDirective(name:string,namespace:string):DirectiveOption{
    name=name.toLowerCase()
    namespace=namespace.toLowerCase()
    let option=namespaces[namespace] && namespaces[namespace][name]
    return option
}
export function IsDirectiveRegistered(name:string,namespace:string){
    name=name.toLowerCase()
    namespace=namespace.toLowerCase()
    if(namespaces[namespace] && namespaces[namespace][name])
        return true
    else
        return false
}
function checkOption(option:DirectiveOption){
    if(IsStringEmpty(option.$name))
        throw new Error("directive name should not be null")
    if(namespaces[option.$namespace] && namespaces[option.$namespace][option.$name])
        throw new Error("directive "+option.$name +" has already exist")
}