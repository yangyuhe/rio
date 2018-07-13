import { NoticeCallback, RegisterNotice, RevokeNotice } from './../observer/notice-center';
import { EvalExp } from "../eval";
import { ReactiveComputed, ReactiveData, ReactiveKey } from "../observer/observer";
import { Watcher } from "../observer/watcher";
import { GetActiveRouter } from "../router/router-state";
import { NewVNode, TraverseDom } from "../vdom/vdom";
import { VNode } from "../vnode/vnode";
import { DomStatus, OnDataChange, RouterState } from './../models';
import { VinallaNode } from './../vnode/vinalla-node';
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
    $CreateWatcher(vnode:VNode,exp:string|Function,listener:OnDataChange,watchingArrayItem?:boolean):Watcher{
        return new Watcher(this,vnode,exp,listener,watchingArrayItem)
    }
    $Watch(exp:string|Function,listener:OnDataChange,watchingArrayItem:boolean=false){
        this.$CreateWatcher(this.$treeRoot,exp,listener,watchingArrayItem)
    }
    
    $OnDestroy(){
        this.$treeRoot.OnDestroy()
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
        this.$treeRoot.Refresh()
    }
    $RevokeMethod(method:string,...params:any[]){
        if(typeof (this as any)[method]=="function")
            (this as any)[method].apply(this,params)
        else
            throw new Error(method +" is not a function")
    }
    /**动态的增加响应式数据 */
    $AddReactiveData(name:string,value:any){
        this.$data[name]=value;
        Object.defineProperty(this,name,{
            get:()=>{
                return this.$data[name]
            },
            set:(value:any)=>{
                this.$data[name]=value
            }
        });
        ReactiveKey(this.$data,name);
        ReactiveData(value);
    }
    GetAnchorNode(name:string):VinallaNode{
        return this.$treeRoot.GetAnchor(name);
    }
    /**动态添加节点 */
    $AddFragment(html:string,anchor:string){
        let res=(new DOMParser()).parseFromString(html, "text/html").body;
        let anchorNode=this.GetAnchorNode(anchor);
        if(anchorNode){
            for(let i=0;i<res.childNodes.length;i++){
                let domtree=TraverseDom(res.childNodes[i]);
                let vnode=NewVNode(domtree,this,anchorNode);
                vnode.AttachChildren();
                anchorNode.Children.push(vnode);
                vnode.Render();
            }
            anchorNode.Refresh();
        }else{
            throw new Error('anchor node '+anchor+" not exist");
        }
        
    }
    /**注册消息 */
    $on(notice:string,cb:NoticeCallback){
        RegisterNotice(notice,this.$treeRoot,cb);
    }
    /**触发消息 */
    $broadcast(notice:string,...params:any[]){
        RevokeNotice(notice,...params);
    }

    abstract $InitDataItems():{name:string,value:any}[];
    abstract $InitComputeItems():{name:string,get:(()=>any)}[];
    abstract $InitNamespace():string;

    abstract $Render():DomStatus;
    
    abstract $InitTreeroot():VNode;

    
}