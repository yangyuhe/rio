import { Observe } from "../observer/observe";
import { GetActiveRouter } from "../router/router-state";
import { VNode } from "../vnode/vnode";
import { OnDataChange, RouterState } from './../models';
export abstract class Mvvm {
    private $data:any={}
    protected $observe:Observe

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
        this.$observe=new Observe(this)    
        this.$dataItems=this.$InitDataItems()
        this.$computeItems=this.$InitComputeItems()
        this.$treeRoot=this.$InitTreeroot()

        this.$treeRoot.AttachDom()

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
        this.$observe.ReactiveData(this.$data)

        this.$computeItems.forEach(item=>{
            this.$observe.WatchComputed(this.$treeRoot,item.name,item.get)
        })
    }
    
    $GetExpValue(exp:string):any{
        return this.$observe.GetValueWithExp(exp)
    }
    
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
    $Watch(vnode:VNode,exp:string|Function,listener:OnDataChange,arraydeep?:boolean){
        this.$observe.AddWatcher(vnode,exp,listener,arraydeep)
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
    abstract $InitDataItems():{name:string,value:any}[];
    abstract $InitComputeItems():{name:string,get:(()=>any)}[];
    abstract $InitNamespace():string;

    abstract $Render():Node;
    abstract $RevokeMethod(method:string,...params:any[]):void;
    abstract $InitTreeroot():VNode;
}