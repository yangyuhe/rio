import { Observe } from './../observer/observe';
import { Prop } from "../models";
import { DirectiveOption, OnDataChange } from './../models';
import { Directive } from "../vnode/directive";
import { VNode } from "../vnode/vnode";
export class DirectiveMVVM {
    
    private $data:any
    private $methods:{[name:string]:Function}={}
    private $name:string
    $element:HTMLElement

    $Ins:Prop[]=[]
    $Outs:string[]=[]
    $observe:Observe

    constructor(option:DirectiveOption,private $directive:Directive,private $vnode:VNode){
        if(option.data!=null)
            this.$data=JSON.parse(JSON.stringify(option.data))
        else
            this.$data={}
        this.$methods=option.methods  ||{}
        
        
        this.$Ins=option.props || []
        this.$Outs=option.events || []

        this.proxyData()
        this.proxyMethod()

        this.$observe=new Observe(this)
        
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
    
    
    $ondestroy(){
        if(this.$methods["$destroy"]!=null){
            this.$methods["$destroy"]()
        }
    }
    $watch(exp:string|Function,cb:OnDataChange){
        this.$observe.AddWatcher(this.$vnode,exp,cb)
    }
    Render(){
        this.$element=(this.$vnode.Dom as HTMLElement)
        this.$Ins.forEach(prop=>{
            let inName=this.$directive.GetIn(prop.name)
            if(inName==null && prop.required){
                throw new Error("component \'"+this.$name+"\' need prop \'"+prop.name)
            }
            if(inName!=null){
                this.$vnode.mvvm.$watch(this.$vnode,inName,(newvalue:any,oldvalue:any)=>{
                    this.$checkProp(prop,newvalue);
                    (this as any)[prop.name]=newvalue
                });
                this.$observe.ReactiveKey(this,prop.name,true)
            }
        })
        if(this.$methods && this.$methods.$init){
            this.$methods.$init.call(this)
        }
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