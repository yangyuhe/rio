import { EvalExp } from "../eval";
import { DomStatus, OnDataChange, RouterInfo, State } from '../models';
import { IEvalable } from '../observer/IEvalable';
import { NoticeCallback, RegisterNotice, RevokeNotice } from '../observer/notice-center';
import { ReactiveComputed, ReactiveData, ReactiveKey } from "../observer/observer";
import { Watcher } from "../observer/watcher";
import { NotifyUrlChange } from '../router/router-manager';
import { GetActiveRouter, WatchRouterChange } from "../router/router-state";
import { Parse } from '../vdom/parser';
import { NewVNode } from "../vdom/vdom";
import { VinallaNode } from '../vnode/vinalla-node';
import { VNode } from "../vnode/vnode";
import { GetGlobalState } from './root-mvvm';
export abstract class Mvvm implements IEvalable{
    public $namespace="default"

    protected $treeRoot:VNode
    
    protected $dataItems:{name:string,value:any}[]=[]
    protected $computeItems:{name:string,get:()=>any}[]=[]
    private $isroot=false
    private $states:State[]=[]

    private nextTicksCbs:(()=>void)[]=[]

    protected get $router(){
        return GetActiveRouter()
    }

    constructor(){
    }
    $initialize(){
        this.$states=this.$DecoratorStates();
        this.$dataItems=this.$InitDataItems()
        this.$computeItems=this.$InitComputeItems()
        this.$treeRoot=this.$InitTreeroot()
        this.$namespace=this.$InitNamespace()

        this.$dataItems.forEach(item=>{
            ReactiveKey(this,item.name);
            ReactiveData(item.value);
        });

        this.$computeItems.forEach(item=>{
            ReactiveComputed(this,this.$treeRoot,item.name,item.get)
        });
        this.$states.forEach(prop=>{
            let state=GetGlobalState(prop.name);
            if(state==null){
                throw new Error(" need global state \'"+prop.name+"'");
            }
            Object.defineProperty(this,prop.origin,{
                get:()=>{
                    let newvalue=GetGlobalState(prop.name);
                    this.$checkState(prop,newvalue);
                    return newvalue;
                },
                set:()=>{
                    throw new Error("can not change value of global state in mvvm");
                }
            });
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
        let keys=exp.split(".");
        let target:any=this;
        let hasTraget=true;
        for(let i=0;i<keys.length-1;i++){
            if(target!=null)
                target=target.$GetExpOrFunValue(keys[i]);
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
        (this as any)[name]=value;
        ReactiveKey(this,name);
        ReactiveData(value);
    }
    private getAnchorNode(name:string):VinallaNode{
        return this.$treeRoot.GetAnchor(name);
    }
    GetRef(ref:string){
        let vnode= this.$treeRoot.GetAnchor(ref);
        if(vnode!=null && vnode.statefulDom.length>0)
            return vnode.statefulDom[0].dom as HTMLElement;
        else
            return null;
    }
    /**动态添加节点 */
    $AddFragment(html:string,anchor:string){
        let res=Parse(html);
        let anchorNode=this.getAnchorNode(anchor);
        if(anchorNode){
            for(let i=0;i<res.length;i++){
                let domtree=res[i];
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
    protected $on(notice:string,cb:NoticeCallback){
        RegisterNotice(notice,this.$treeRoot,cb);
    }
    /**触发消息 */
    protected $broadcast(notice:string,...params:any[]){
        RevokeNotice(notice,...params);
    }
    /**监视路由变化 */
    protected $onRouterChange(callbck:(newrouter:RouterInfo,oldrouter:RouterInfo)=>void){
        WatchRouterChange(this.$treeRoot,callbck);
    }
    $NavigateTo(url:string){
        window.history.replaceState(null,null,url)
        NotifyUrlChange()
    }

    $OnMount(){
        this.$treeRoot.OnMount();
    }
    $NoticeNextTickListener(){
        this.nextTicksCbs.forEach(cb=>cb());
        this.nextTicksCbs=[];
        this.$treeRoot.OnNextTick();
    }
    $OnNextTick(cb:()=>void){
        this.nextTicksCbs.push(cb);
    }

    private $checkState(prop:State,value:any){
        let error=(prop:string,type:string)=>{
            throw new Error("global state \'"+prop+"\' not receive "+type)
        }
        if(prop.type=="array" && toString.call(value)!="[object Array]"){
            error(prop.name,prop.type)
        }
        if(prop.type=="object" && toString.call(value)!="[object Object]"){
            error(prop.name,prop.type)
        }
        if(prop.type=="number" && toString.call(value)!="[object Number]"){
            error(prop.name,prop.type)
        }
        if(prop.type=="boolean" && toString.call(value)!="[object Boolean]"){
            error(prop.name,prop.type)
        }
        if(prop.type=="string" && toString.call(value)!="[object String]"){
            error(prop.name,prop.type)
        }
    }

    $GetTreeRoot(){
        return this.$treeRoot;
    }

    abstract $InitDataItems():{name:string,value:any}[];
    abstract $InitComputeItems():{name:string,get:(()=>any)}[];
    abstract $InitNamespace():string;

    abstract $Render():DomStatus;
    
    abstract $InitTreeroot():VNode;

    abstract $DecoratorStates():State[];

    
}