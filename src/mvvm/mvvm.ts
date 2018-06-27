import { GetActiveRouter } from "../router/router-state";
import { VNode } from "../vnode/vnode";
import { OnDataChange, RouterState, DomStatus } from './../models';
import {ReactiveData, ReactiveComputed} from "../observer/observer"
import {EvalExp} from "../eval"
import { Watcher } from "../observer/watcher";
export abstract class Mvvm {
    private $data:any={}
    protected $namespace="default"

    protected $treeRoot:VNode
    
    protected $dataItems:{name:string,value:any}[]=[]
    protected $computeItems:{name:string,get:()=>any}[]=[]
    private $isroot=false

    protected get $router():RouterState{
        return {
            active:GetActiveRouter(),
            cur:null
        }
    }

    constructor(){
    }
    $initialize(){
        this.$dataItems=this.$InitDataItems()
        this.$computeItems=this.$InitComputeItems()
        this.$treeRoot=this.$InitTreeroot()
        this.$namespace=this.$InitNamespace()

        this.$dataItems.forEach(item=>{
            this.$data[item.name]=item.value
            Object.defineProperty(this,item.name,{
                get:()=>{
                    return this.$data[item.name]
                },
                set:(value:any)=>{
                    this.$data[item.name]=value
                }
            })
        })
        ReactiveData(this.$data)

        this.$computeItems.forEach(item=>{
            ReactiveComputed(this,this.$treeRoot,item.name,item.get)
        })

    }
    $AttachChildren(){
        this.$treeRoot.AttachChildren()
    }
    
    $GetExpOrFunValue(expOrFunc:string|Function):any{
        let res:any;
        if(typeof expOrFunc == "string"){
            res=EvalExp(this,expOrFunc)
        }
        if(typeof expOrFunc =="function"){
            res=expOrFunc.call(this)
        }
        return res;
    }
    $ExtendMvvm():Mvvm{return this;}
    
    $SetValue(exp:string,value:any){
        let keys=exp.split(".")
        let target=this.$data
        let hasTraget=true
        for(let i=0;i<keys.length-1;i++){
            if(target!=null)
                target=target[keys[i]]
            else{
                hasTraget=false
                break
            }
        }
        if(hasTraget && target!=null)
            target[keys[keys.length-1]]=value
    }
    $CreateWatcher(vnode:VNode,exp:string|Function,listener:OnDataChange,watchingArrayItem?:boolean){
        new Watcher(this,vnode,exp,listener,watchingArrayItem)
    }
    
    $OnDestroy(){
        this.$treeRoot.OnRemoved()
    }
    $SetRoot(isroot:boolean){
        this.$isroot=isroot
    }
    $IsRoot(){
        return this.$isroot
    }
    $GetDataItems(){
        return this.$dataItems
    }
    $GetComputedItems(){
        return this.$computeItems
    }
    $Refresh(){
        this.$treeRoot.Rerender()
    }
    $RevokeMethod(method:string,...params:any[]){
        if(typeof (this as any)[method]=="function")
            (this as any)[method].apply(this,params)
        else
            throw new Error(method +" is not a function")
    }

    abstract $InitDataItems():{name:string,value:any}[];
    abstract $InitComputeItems():{name:string,get:(()=>any)}[];
    abstract $InitNamespace():string;

    abstract $Render():DomStatus;
    
    abstract $InitTreeroot():VNode;

    
}