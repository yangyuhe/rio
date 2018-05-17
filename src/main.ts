import { RegisterComponent, Start } from "./manager/components-manager";
import { ComponentOption, DirectiveOption } from "./models";
import { RegisterDirective } from "./manager/directive-manager";
(<any>window).Rio={
    component:function(name:string,option:ComponentOption,namespace:string){
        option.$name=name
        if(namespace!=null)
            option.$namespace=namespace
        else
            option.$namespace="default"
        RegisterComponent(option)
        return this
    },
    directive:function(name:string,option:DirectiveOption,namespace:string){
        option.$name=name
        if(namespace!=null)
            option.$namespace=namespace
        else
            option.$namespace="default"
        RegisterDirective(option)
        return this
    },
    namespace:function(namespace:string){
        return {
            component:function(name:string,option:ComponentOption){
                (<any>window).Rio.component(name,option,namespace)
                return this
            },
            directive:function(name:string,option:DirectiveOption){
                (<any>window).Rio.directive(name,option,namespace)
                return this
            }
        }
    }
}
document.addEventListener("DOMContentLoaded",function(){
    Start()
})