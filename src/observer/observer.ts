import { VNode } from '../vnode/vnode';
import { Watcher } from "./watcher";
import { WatcherCollecter } from './watcher-collect';
import { IEvalable } from './IEvalable';

let $target:Watcher

export function SetTarget(target:Watcher){
    $target=target
}
export function CleanTarget(){
    $target=null
}
    
export function ReactiveData(data:any){
    if(toString.call(data)=="[object Array]"){
        
        for(let value of data){
            ReactiveData(value);
        }
        return;
    }
    if(toString.call(data)=="[object Object]"){
        Object.keys(data).forEach(key=>{
            ReactiveKey(data,key)
            ReactiveData(data[key])
        });
        return;
    }
    
}
export function ReactiveKey(data:any,key:string){
    let collecter=new WatcherCollecter(key)        
    let value = data[key]
    if(toString.call(value)=="[object Array]"){
        reactiveArray(value,collecter)
    }
    Object.defineProperty(data, key, {
        get: ()=> {
            if($target!=null){
                collecter.AddTarget($target)
            }
            return value
        },
        set: (newval)=>{
            if (newval != value) {
                value=newval
                if(toString.call(value)=="[object Array]"){
                    reactiveArray(value,collecter)
                }
                ReactiveData(newval)                    
                collecter.Notify()
            }
        },
        enumerable:true,
        configurable:true
    })
}
    
function reactiveArray(array:any[],collecter:WatcherCollecter){
    
    Object.defineProperty(array,"push",{
        enumerable:false,
        configurable:true,
        value:(...params:any[])=>{
            let res=Array.prototype.push.call(array,...params);
            collecter.Notify();
            return res;
        }
    })
    Object.defineProperty(array,"pop",{
        enumerable:false,
        configurable:true,
        value:(...params:any[])=>{
            let res=Array.prototype.pop.call(array,...params);
            collecter.Notify();
            return res;
        }
    })
    Object.defineProperty(array,"splice",{
        enumerable:false,
        configurable:true,
        value:(...params:any[])=>{
            let res=Array.prototype.splice.call(array,...params);
            collecter.Notify();
            return res
        }
    })
    Object.defineProperty(array,"shift",{
        enumerable:false,
        configurable:true,
        value:(...params:any[])=>{
            let res=Array.prototype.shift.call(array,...params)
            collecter.Notify()                
            return res
        }
    });
    Object.defineProperty(array,"sort",{
        enumerable:false,
        configurable:true,
        value:(...params:any[])=>{
            let res=Array.prototype.sort.call(array,...params)
            collecter.Notify()                
            return res
        }
    });
}
    
export function ReactiveComputed(evalable:IEvalable,vnode:VNode,key:string,func:()=>any){
    let collecter=new WatcherCollecter(key)
    let firstget=true
    let value:any
    
    Object.defineProperty(evalable, key, {
        get: ()=> {
            if($target!=null){
                collecter.AddTarget($target)
            }
            if(firstget){
                let old=$target
                $target=null
                let watcher=new Watcher(evalable,vnode,func,(newval)=>{
                    value=newval
                    collecter.Notify()
                })
                value=watcher.GetCurValue();
                $target=old
                firstget=false
            }
            return value
        },
        enumerable:true,
        configurable:true
    })
}

