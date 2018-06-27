import { AppMvvm } from './../mvvm/app-mvvm';
import { GetApp } from "./app-manager";

let apps:AppMvvm[]=[]
export function Start() {
    let appscons=GetApp()
    appscons.forEach(App=>{
        let mvvm=new App()
        mvvm.$initialize()
        mvvm.$AttachChildren()
        mvvm.$SetRoot(true)
        apps.push(mvvm)
        let content = mvvm.$Render()
        let target=document.querySelector(mvvm.$InitEl())
        target.parentElement.replaceChild(content.dom, target)
    })
    
}
export function RefreshApp(){
    apps.forEach(app=>app.$Refresh())
}