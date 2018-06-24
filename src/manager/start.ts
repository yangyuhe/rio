import { GetApp } from "./app-manager";

export function Start() {
    let apps=GetApp()
    apps.forEach(App=>{
        let mvvm=new App()
        mvvm.$initialize()
        mvvm.$SetRoot(true)
    
        let content = mvvm.$Render()
        let target=document.querySelector(mvvm.$InitEl())
        target.parentElement.replaceChild(content, target)
    })
    
}