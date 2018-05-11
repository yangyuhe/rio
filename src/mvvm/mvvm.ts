import { MVVMComponentOption } from "../models";
import { CustomNode } from "../vnode/custom-node";
import { VNode } from "../vnode/vnode";
import { OnDataChange } from './../models';
import { VDom } from './../vdom/vdom';
import { RevokeEvent } from './revoke-event';
import { Observe } from "../observer/observe";
export class MVVM {
    FenceNode:CustomNode
    TreeRoot:VNode
    
    private data:any
    private methods:{[name:string]:Function}={}
    private template:string
    private domtree:VDom

    Namespace:string
    Ins:string[]=[]
    Outs:string[]=[]
    private observe:Observe

    constructor(option:MVVMComponentOption){
        if(option.data!=null)
            this.data=JSON.parse(JSON.stringify(option.data))
        else
            this.data={}
        this.methods=option.methods  ||{}
        this.template=option.template
        this.Namespace=option.$namespace
        this.domtree=option.$domtree

        if(option.methods && option.methods.$init){
            option.methods.$init.call(this)
        }
        this.Ins=option.props || []
        this.Outs=option.events || []

        this.observe=new Observe(this.data)
        this.observe.Walk()
        for(let key in this.data){
            this.proxyData(key)
        }
    }
    private proxyData(key:string){
        Object.defineProperty(this,key,{
            get:function(){
                return this.data[key]
            },
            set:function(newval){
                this.data[key]=newval
            }
        })
    }
    private hirented=false
    
    
    SetHirented(hirentedFromParent:boolean){
        this.hirented=hirentedFromParent
    }
    GetTemplate():string{
        return this.template
    }
    GetDomTree():VDom{
        return this.domtree
    }
    Render(){
        this.TreeRoot.Render()
        return this.TreeRoot.Dom
    }
    RevokeMethod(method:string,...params:any[]){
        if(this.hirented){
            this.FenceNode.mvvm.RevokeMethod(method,...params)
        }else{
            if(this.methods[method]!=null)
                this.methods[method].apply(this,params)
        }
    }
    
    GetExpValue(exp:string):any{
        return this.observe.GetValueWithExp(exp)
    }
    
    SetValue(exp:string,value:any){
        let keys=exp.split(".")
        let target=this.data
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
        if(this.FenceNode!=null && this.FenceNode.mvvm!=null){
            let method=this.FenceNode.GetOut(event)
            RevokeEvent(method,data,this.FenceNode.mvvm)
        }
    };
    public $watchExp(vnode:VNode,exp:string,listener:OnDataChange,deep?:boolean){
        this.observe.AddWatcher(vnode,exp,listener,deep)
    }
    
    $ondestroy(){
        
    }
    Reconstruct(){
        if(this.hirented){
            Object.keys(this.FenceNode.mvvm.data).forEach(key=>{
                this.data[key]=this.FenceNode.mvvm.data[key]
                this.proxyData(key)
                this.observe.DefineReactive(this.data,key)
            })
        }
        this.Ins.forEach(prop=>{
            this.data[prop]=this.FenceNode.GetInValue(prop)
            this.proxyData(prop)
            this.observe.DefineReactive(this.data,prop)
        })
        this.TreeRoot.Reconstruct()
    }
    StartWatch(){
        if(this.hirented){
            Object.keys(this.FenceNode.mvvm.data).forEach(key=>{
                this.FenceNode.mvvm.$watchExp(this.FenceNode,key,(newvalue:any,oldvalue:any)=>{
                    this.data[key]=newvalue
                })
            })
        }
        this.Ins.forEach(prop=>{
            let inName=this.FenceNode.GetIn(prop)
            this.FenceNode.mvvm.$watchExp(this.FenceNode,inName,(newvalue:any,oldvalue:any)=>{
                this.data[prop]=newvalue
            })
        })
        this.TreeRoot.StartWatch()
    }
}