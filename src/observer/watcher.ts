import { VNode } from './../vnode/vnode';
import { OnDataChange } from './../models';
import { Observe } from './observe';
import { VNodeStatus } from '../const';


export class Watcher{
    private value:any
    private deepRecord:any[]=[]
    constructor(private vnode:VNode,public Exp:string,private cb:OnDataChange,private observer:Observe,private deep?:boolean){
        this.value=this.observer.GetValue(this)
        if(this.deep && toString.call(this.value)=="[object Array]"){
            for(let i=0;i<this.value.length;i++){
                this.deepRecord[i]=this.value[i]
            }
        }
    }
    GetVNode(){
        return this.vnode
    }
    Update(){
        let newval=this.observer.GetValue(this)
        if(this.value!=newval){
            if(this.vnode.GetStatus()==VNodeStatus.ACTIVE)
                this.cb(newval,this.value)
            this.value=newval
        }else{
            //判断数组元素是否有变化
            if(this.deep && toString.call(this.value)=="[object Array]" ){
                let diff=false
                for(let i=0;i<newval.length;i++){
                    if(newval[i]!=this.deepRecord[i]){
                        this.cb(newval,this.value)
                        diff=true
                        break
                    }
                }
                if(diff){
                    this.deepRecord=[]
                    for(let i=0;i<newval.length;i++){
                        this.deepRecord[i]=newval[i]
                    }
                }
            }
        }
        
        
    }
}