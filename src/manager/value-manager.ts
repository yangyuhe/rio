
let namespaces:{[namespace:string]:{[valuename:string]:any}}={
    "default":{
    }
}
export function RegisterValue(value:{[name:string]:any},namespace:string){
    if(namespaces[namespace]==null)
        namespaces[namespace]={}
    let values=namespaces[namespace]
    for(let key in value){
        values[key]=value[key]
    }
}
export function GetValue(name:string,namespace:string):any{
    return namespaces[namespace] && namespaces[namespace][name]
}
export function GetValues(namespace:string):any{
    return namespaces[namespace]
}
export function IsValueRegistered(name:string,namespace:string){
    if(namespaces[namespace] && namespaces[namespace][name])
        return true
    else
        return false
}