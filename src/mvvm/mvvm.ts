import { MVVMComponentOption, Prop } from "../models";
import { CustomNode } from "../vnode/custom-node";
import { VNode } from "../vnode/vnode";
import { OnDataChange } from './../models';
import { VDom } from './../vdom/vdom';
import { RevokeEvent } from './revoke-event';
import { Observe } from "../observer/observe";
export class MVVM {
    $FenceNode:CustomNode
    $TreeRoot:VNode
    
    private $data:any
    private $methods:{[name:string]:Function}={}
    private $template:string
    private $domtree:VDom
    private $computed:{[name:string]:()=>any}={}

    $Namespace:string
    $Ins:Prop[]=[]
    $Outs:string[]=[]
    private $observe:Observe
    private $name:string=""
    private hirented=false    

    constructor(option:MVVMComponentOption){
        if(option.data!=null)
            this.$data=JSON.parse(JSON.stringify(option.data))
        else
            this.$data={}
        this.$methods=option.methods  ||{}
        this.$name=option.$name||""
        this.$computed=option.computed||{}

        this.$template=option.template
        this.$Namespace=option.$namespace
        this.$domtree=option.$domtree


        if(option.methods && option.methods.$init){
            option.methods.$init.call(this)
        }
        this.$Ins=option.props || []
        this.$Outs=option.events || []

        this.$observe=new Observe(this)
        this.$observe.ReactiveData(this.$data)
        this.proxyData()
        this.proxyMethod()
        
    }
    private proxyData(){
        for(let key in this.$data){
            Object.defineProperty(this,key,{
                get:function(){
                    return this.$data[key]
                },
                set:function(newval){
                    this.$data[key]=newval
                }
            })
        }
    }
    private proxyMethod(){
        for(let key in this.$methods){
            Object.defineProperty(this,key,{
                get:function(){
                    return this.$methods[key]
                }
            })
        }
    }
    
    private proxyComputed(){
        for(let key in this.$computed){
            this.$observe.WatchComputed(this.$FenceNode,key,this.$computed[key])
        }
    }
    
    SetHirented(hirentedFromParent:boolean){
        this.hirented=hirentedFromParent
    }
    GetTemplate():string{
        return this.$template
    }
    GetDomTree():VDom{
        return this.$domtree
    }
    Render(){
        this.proxyComputed()
        if(this.hirented){
            Object.keys(this.$FenceNode.mvvm.$data).forEach(key=>{
                this.$FenceNode.mvvm.$watchExpOrFunc(this.$FenceNode,key,(newvalue:any,oldvalue:any)=>{
                    (this as any)[key]=newvalue
                })
                this.$observe.ReactiveKey(this,key,true)                                   
            })
            Object.keys(this.$FenceNode.mvvm.$computed).forEach(key=>{
                this.$FenceNode.mvvm.$watchExpOrFunc(this.$FenceNode,key,(newvalue:any,oldvalue:any)=>{
                    (this as any)[key]=newvalue
                })
                this.$observe.ReactiveKey(this,key,true)      
            })
        }
        this.$Ins.forEach(prop=>{
            if(this.$FenceNode.GetIn(prop.name)==null && prop.required){
                throw new Error("component \'"+this.$name+"\' need prop \'"+prop.name)
            }
            let inName=this.$FenceNode.GetIn(prop.name)
            this.$FenceNode.mvvm.$watchExpOrFunc(this.$FenceNode,inName,(newvalue:any,oldvalue:any)=>{
                this.$checkProp(prop,newvalue);
                (this as any)[prop.name]=newvalue
            });
            this.$observe.ReactiveKey(this,prop.name,true)
        })
        
        this.$TreeRoot.Render()
        return this.$TreeRoot.Dom
    }
    RevokeMethod(method:string,...params:any[]){
        if(this.hirented){
            this.$FenceNode.mvvm.RevokeMethod(method,...params)
        }else{
            if(this.$methods[method]!=null)
                this.$methods[method].apply(this,params)
        }
    }
    
    GetExpValue(exp:string):any{
        return this.$observe.GetValueWithExp(exp)
    }
    
    SetValue(exp:string,value:any){
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
    $emit(event:string,...data:any[]){
        if(this.$FenceNode!=null && this.$FenceNode.mvvm!=null){
            let method=this.$FenceNode.GetOut(event)
            RevokeEvent(method,data,this.$FenceNode.mvvm)
        }
    };
    public $watchExpOrFunc(vnode:VNode,exp:string|Function,listener:OnDataChange,arraydeep?:boolean){
        this.$observe.AddWatcher(vnode,exp,listener,arraydeep)
    }
    
    $ondestroy(){
        if(this.$methods["$destroy"]!=null){
            this.$methods["$destroy"]()
        }
        this.$TreeRoot.OnRemoved()
    }
    
    private $checkProp(prop:Prop,value:any){
        let error=(name:string,prop:string,type:string)=>{
            throw new Error("component \'"+name+"\' prop \'"+prop+"\' not receive "+type)
        }
        if(prop.type=="array" && toString.call(value)!="[object Array]"){
            error(this.$name,prop.name,prop.type)
        }
        if(prop.type=="object" && toString.call(value)!="[object Object]"){
            error(this.$name,prop.name,prop.type)
        }
        if(prop.type=="number" && toString.call(value)!="[object Number]"){
            error(this.$name,prop.name,prop.type)
        }
        if(prop.type=="boolean" && toString.call(value)!="[object Boolean]"){
            error(this.$name,prop.name,prop.type)
        }
        if(prop.type=="string" && toString.call(value)!="[object String]"){
            error(this.$name,prop.name,prop.type)
        }
    }
}