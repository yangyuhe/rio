import { RegisterComponent, Start } from "./manager/components-manager";
import { MVVMComponentOption } from "./models";
import { RegisterValue } from "./manager/value-manager";
(<any>window).Rio={
    component:function(name:string,option:MVVMComponentOption){
        option.$name=name
        RegisterComponent(option,"default")
        return this
    },
    value:function(value:{[name:string]:any}){
        RegisterValue(value,"default")
        return this
    },
    namespace:function(namespace:string){
        let nc=function(name:string,options:MVVMComponentOption){
            options.$name=name
            RegisterComponent(options,namespace)
            return wrap
        }
        let nv=function(value:any){
            RegisterValue(value,namespace)
            return wrap
        }
        let wrap={
            component:nc,
            value:nv
        }
        return wrap
    }
}
document.addEventListener("DOMContentLoaded",function(){
    Start()
})