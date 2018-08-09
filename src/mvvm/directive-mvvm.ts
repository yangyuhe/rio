import { EvalExp } from "../eval";
import { OnDataChange, Prop } from "../models";
import { NoticeCallback, RegisterNotice, RevokeNotice } from "../observer/notice-center";
import { Watcher } from "../observer/watcher";
import { VinallaNode } from './../vnode/vinalla-node';
export class DirectiveMVVM{
    
    $Name:string
    $element:HTMLElement

    $Ins:Prop[]=[]
    $Outs:string[]=[]

    $InitFuncs:string[]=[]
    $MountFuncs:string[]=[]
    $DestroyFuncs:string[]=[]
    
    private $vnode:VinallaNode;

    $Initialize(vnode:VinallaNode){
        this.$vnode=vnode;
        this.$InitFuncs.forEach(func=>{
            (this as any)[func].call(this)
        });
    }
    
    $OnDestroy(){
        this.$DestroyFuncs.forEach(destroy=>{
            (this as any)[destroy].call(this)
        })
    }
    
    $Render(){
        this.$Ins.forEach(prop=>{
            let inName=this.$vnode.GetIn(prop.name)
            if(inName==null && prop.required){
                throw new Error("component \'"+this.$Name+"\' need prop \'"+prop.name+"'")
            }
            if(inName!=null){
                if(inName.const){
                    (this as any)[prop.origin]=inName.value
                }else{
                    Object.defineProperty(this,prop.origin,{
                        get:()=>{
                            let newvalue=this.$vnode.mvvm.$GetExpOrFunValue(inName.value);
                            this.$checkProp(prop,newvalue);
                            return newvalue;
                        }
                    })
                }
            }
        })
        this.$element=(this.$vnode.DomSet[0].dom as HTMLElement)
        this.$MountFuncs.forEach(func=>{
            (this as any)[func].call(this)
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
    $Watch(exp:string|Function,listener:OnDataChange,watchingArrayItem:boolean=false){
        new Watcher(this,this.$vnode,exp,listener,watchingArrayItem)
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
    /**注册消息 */
    $on(notice:string,cb:NoticeCallback){
        RegisterNotice(notice,this.$vnode,cb);
    }
    /**触发消息 */
    $broadcast(notice:string,...params:any[]){
        RevokeNotice(notice,...params);
    }
    /**动态添加节点 */
    $AddFragment(html:string,anchor:string){
        this.$vnode.mvvm.$AddFragment(html,anchor);
    }
}