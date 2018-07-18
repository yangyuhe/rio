import { PRE } from '../const';
import { VNode } from '../vnode/vnode';
import { Classes } from "./class";
import { OnEvent } from './event';
import { Href } from './href';
import { Html } from "./html";
import { DirModel } from './model';
import { Style } from "./style";

let innerDirs:{[name:string]:InnerDirective}={}
function RegisterInnerDir(name:string,comiple:InnerDirective){
    if(innerDirs[name]!=null)
        throw new Error("inner directive "+name+" already exists")
    innerDirs[name]=comiple
}

export function GetInnerDir(name:string){
    return innerDirs[name]
}

export interface InnerDirective{
    (exp:string,vnode:VNode,options?:string[]):void
}


RegisterInnerDir(PRE+"href",Href)
RegisterInnerDir(PRE+"model",DirModel)
RegisterInnerDir(PRE+"on",OnEvent)
RegisterInnerDir(PRE+"html",Html)
RegisterInnerDir(PRE+"class",Classes)
RegisterInnerDir(PRE+"style",Style)