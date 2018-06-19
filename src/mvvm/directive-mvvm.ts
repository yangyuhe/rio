import { Prop } from "../models";
import { DirectiveNode } from "../vnode/directive-node";
import { VNode } from "../vnode/vnode";
export class DirectiveMVVM {
    

    $Name:string
    $element:HTMLElement


    $Ins:Prop[]=[]
    $Outs:string[]=[]

    $InitFuncs:string[]=[]
    $DestroyFuncs:string[]=[]
    

    constructor(private $directive:DirectiveNode,private $vnode:VNode){
    }
    
    
    $OnDestroy(){
        this.$DestroyFuncs.forEach(destroy=>{
            (this as any)[destroy].call(this)
        })
    }
    
    $Render(){
        this.$element=(this.$vnode.Dom as HTMLElement)
        this.$InitFuncs.forEach(init=>{
            (this as any)[init].call(this)
        })
        this.$Ins.forEach(prop=>{
            let inName=this.$directive.GetIn(prop.name)
            if(inName==null && prop.required){
                throw new Error("component \'"+this.$Name+"\' need prop \'"+prop.name)
            }
            if(inName!=null){
                if(inName.const){
                    (this as any)[prop.name]=inName.value
                }else{
                    this.$vnode.mvvm.$Watch(this.$vnode,inName.value,(newvalue:any,oldvalue:any)=>{
                        this.$checkProp(prop,newvalue);
                        (this as any)[prop.name]=newvalue
                    });
                }
            }
        })
    }
    private $checkProp(prop:Prop,value:any){
        let error=(name:string,prop:string,type:string)=>{
            throw new Error("component \'"+name+"\' prop \'"+prop+"\' not receive "+type)
        }
        if(prop.type=="array" && toString.call(value)!="[object Array]"){
            error(this.$Name,prop.name,prop.type)
        }
        if(prop.type=="object" && toString.call(value)!="[object Object]"){
            error(this.$Name,prop.name,prop.type)
        }
        if(prop.type=="number" && toString.call(value)!="[object Number]"){
            error(this.$Name,prop.name,prop.type)
        }
        if(prop.type=="boolean" && toString.call(value)!="[object Boolean]"){
            error(this.$Name,prop.name,prop.type)
        }
        if(prop.type=="string" && toString.call(value)!="[object String]"){
            error(this.$Name,prop.name,prop.type)
        }
    }
}