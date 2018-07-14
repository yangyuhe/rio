import { VinallaNode } from './../vnode/vinalla-node';
import { Href } from './href';
import { PRE } from '../const';
import { DirModel } from './model';
import { OnEvent } from './event';
import {Html} from "./html"
import {Style} from "./style"
import {Classes} from "./class"

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
    (exp:string,vnode:VinallaNode,options?:string[]):void
}


RegisterInnerDir(PRE+"href",Href)
RegisterInnerDir(PRE+"model",DirModel)
RegisterInnerDir(PRE+"on",OnEvent)
RegisterInnerDir(PRE+"html",Html)
RegisterInnerDir(PRE+"class",Classes)
RegisterInnerDir(PRE+"style",Style)