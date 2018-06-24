import { Prop } from "../models";
import { CustomNode } from "../vnode/custom-node";
import { VNode } from "../vnode/vnode";
import { VNodeStatus } from './../const';
import { Mvvm } from './mvvm';
import { RevokeEvent } from './revoke-event';
export class ComponentMvvm extends Mvvm{
    
    private hirented=false

    private $fenceNode:CustomNode
    private $name:string=""
    
    private $ins:Prop[]=[]

    
    $initialize(){
        super.$initialize()
        this.$name=this.$InitName()
        this.$ins=this.$InitIns()
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

    $SetHirented(hirentedFromParent:boolean){
        this.hirented=hirentedFromParent
    }

    $Render(){
        if(this.hirented){
            this.$dataItems.forEach(item=>{
                this.$fenceNode.mvvm.$Watch(this.$fenceNode,item.name,(newvalue:any,oldvalue:any)=>{
                    (this as any)[item.name]=newvalue
                })
            })
        }
        this.$ins.forEach(prop=>{
            let inName=this.$fenceNode.GetIn(prop.name)
            if(inName==null && prop.required){
                throw new Error("component \'"+this.$name+"\' need prop \'"+prop.name)
            }
            if(inName!=null){
                if(inName.const){
                    (this as any)[prop.name]=inName.value
                }else{
                    this.$fenceNode.mvvm.$Watch(this.$fenceNode,inName.value,(newvalue:any,oldvalue:any)=>{
                        this.$checkProp(prop,newvalue);
                        (this as any)[prop.name]=newvalue
                    });
                    this.$observe.ReactiveKey(this,prop.name,true)
                }
            }
        })
        
        this.$treeRoot.Render()
        return this.$treeRoot.Dom
    }
    $Refresh(){
        this.$treeRoot.Refresh()
    }
    $Update(){
        this.$treeRoot.Update()
    }
    $SetStatus(status:VNodeStatus){
        this.$treeRoot.SetStatus(status)
    }
    $RevokeMethod(method:string,...params:any[]){
        if(this.hirented){
            this.$fenceNode.mvvm.$RevokeMethod(method,...params)
        }else{
            if(typeof (this as any)[method]=="function")
                (this as any)[method].apply(this,params)
        }
    }
    
    $Emit(event:string,...data:any[]){
        if(this.$fenceNode!=null && this.$fenceNode.mvvm!=null){
            let method=this.$fenceNode.GetOut(event)
            RevokeEvent(method,data,this.$fenceNode.mvvm)
        }
    };
    
    $OnRouterChange(){
        this.$treeRoot.OnRouterChange()
    }
    $GetFenceNode(){
        return this.$fenceNode
    }
    $SetFenceNode(node:CustomNode){
        this.$fenceNode=node
    }

    
    $InitNamespace(): string {
        throw new Error("Method not implemented.");
    }
    $InitDataItems(): {name:string,value:any}[] {
        throw new Error("Method not implemented.");
    }
    $InitComputeItems(): { name: string; get: () => any }[] {
        throw new Error("Method not implemented.");
    }
    $InitName():string{
        throw new Error("Method not implemented.");
    }
    $InitIns():Prop[]{
        throw new Error("Method not implemented.");
    }
    $InitOuts():string[]{
        throw new Error("Method not implemented.");
    }
    $InitTreeroot(): VNode {
        throw new Error("Method not implemented.");
    }
    $GetIns(){
        return this.$ins
    }
}