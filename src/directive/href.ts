import { PRE } from "../const";
import { StrToEvalstr } from "../util";
import { VNode } from "../vnode/vnode";

export function Href(exp:string,vnode:VNode){
    let href:string="";
    let streval=StrToEvalstr(exp);
    let dom=vnode.DomSet[0].dom as HTMLElement;
    if(streval.isconst){
        href=streval.exp;
        setAttr(dom,href);
    }
    else{                
        let watcher=vnode.mvvm.$CreateWatcher(vnode,streval.exp,newvalue=>{
            href=newvalue;
            setAttr(dom,href);
        });
        href=watcher.GetCurValue();
        setAttr(dom,href);
    }
        
    dom.addEventListener("click",(event:Event)=>{
        if(dom.nodeName=='A'){
            event.preventDefault();
        }
        vnode.mvvm.$NavigateTo(href);
    });
}
function setAttr(dom:HTMLElement,value:string){
    if(dom.nodeName=="A")
        dom.setAttribute("href",value);
    else
        dom.setAttribute(PRE+"href",value);
}
