import { EvalExp } from "../eval";
import { IEvalable } from "../observer/IEvalable";
import { ReactiveData, ReactiveKey } from "../observer/observer";
import { VNode } from "../vnode/vnode";
import { OnDataChange } from "../models";
import { Watcher } from "../observer/watcher";
import { Mvvm } from "./mvvm";
import { CustomNode } from "../vnode/custom-node";
import { DirectiveMVVM } from "./directive-mvvm";

class RootMvvm implements IEvalable{
    $GetExpOrFunValue(expOrFunc: string | Function) {
        let res:any;
        if(typeof expOrFunc == "string"){
            res=EvalExp(this,expOrFunc)
        }
        if(typeof expOrFunc =="function"){
            res=expOrFunc.call(this)
        }
        return res;
    }

    
    $AddReactiveData(name:string,value:any){
        (this as any)[name]=value;
        ReactiveKey(this,name);
        ReactiveData(value);
    }

    $CreateWatcher(vnode:VNode,exp:string|Function,listener:OnDataChange,watchingArrayItem?:boolean):Watcher{
        return new Watcher(this,vnode,exp,listener,watchingArrayItem)
    }

}
export interface StateManipulate<T>{
    send(data:T):void;
    value():T;
    subscribe(mvvm:Mvvm|DirectiveMVVM,exp:string|Function,listener:OnDataChange):void;
}

let globalMvvm=new RootMvvm();
export function CreateState<T>(property:string,data:T):StateManipulate<T>{
    globalMvvm.$AddReactiveData(property,data);
    return {
        send(data:T){
            (globalMvvm as any)[property]=data;
            
        },
        value(){
            return (globalMvvm as any)[property];
        },
        subscribe(mvvm:Mvvm|DirectiveMVVM,exp:string|Function,listener:OnDataChange){
            let value=globalMvvm.$GetExpOrFunValue(exp);
            let isarray=toString.call(value)=="[object Array]";
            if(mvvm!=null){
                if(mvvm instanceof Mvvm)
                    globalMvvm.$CreateWatcher(mvvm.$GetTreeRoot(),exp,listener,isarray);
                else
                    globalMvvm.$CreateWatcher(mvvm.$vnode,exp,listener,isarray);
            }else{
                let custnode=new CustomNode(null,null,null,null);
                globalMvvm.$CreateWatcher(custnode,exp,listener,isarray);
            }
        }
    }
}
export function GetGlobalState(property:string){
    return (globalMvvm as any)[property];
}