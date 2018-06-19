import { GetApp } from "./app-manager";

export function Start() {
    let apps=GetApp()
    apps.forEach(App=>{
        let mvvm=new App()
        mvvm.$SetRoot(true)
    
        let content = mvvm.$Render()
        let target=document.querySelector(mvvm.$GetEl())
        target.parentElement.replaceChild(content, target)
    })
    
}