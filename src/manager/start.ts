import { AppMvvm } from './../mvvm/app-mvvm';
import { GetApp } from "./app-manager";
import {StartMatchUrl} from "../router/router-manager"
let apps:AppMvvm[]=[]
export function Start() {
    let appscons=GetApp()
    appscons.forEach(App=>{
        StartMatchUrl()
        let mvvm=new App()
        mvvm.$initialize()
        mvvm.$AttachChildren()
        mvvm.$SetRoot(true)
        apps.push(mvvm)
        let content = mvvm.$Render()
        let target=document.querySelector(mvvm.$InitEl())
        
        let rootdom=content.dom as HTMLElement;
        if(rootdom.style.display=="none"){
            rootdom.style.display="";
        }

        target.parentElement.replaceChild(content.dom, target)
    })
    
}
export function RefreshApp(){
    apps.forEach(app=>app.$Refresh())
}