import {VNode} from '../vnode/vnode';
import { Href } from './href';
import { PRE } from '../const';
import { DirModel } from './model';
import { OnClick } from './onclick';

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
    (exp:string,vnode:VNode,isconst:boolean,):void
}


RegisterInnerDir(PRE+"href",Href)
RegisterInnerDir(PRE+"model",DirModel)
RegisterInnerDir(PRE+"click",OnClick)