import { DomStatus, Event, Prop } from "../models";
import { TypeOf } from "../util";
import { CustomNode } from "../vnode/custom-node";
import { VNode } from "../vnode/vnode";
import { VNodeStatus } from './../const';
import { Mvvm } from './mvvm';
export class ComponentMvvm extends Mvvm{
    

    private $fenceNode:CustomNode
    private $name:string=""
    
    private $ins:Prop[]=[]
    private $outs:Event[]=[]

    
    $initialize(){
        super.$initialize()

        this.$ins=this.$InitIns()
        this.$outs=this.$InitOuts()
        this.$name=this.$InitName()

        this.$ins.forEach(prop=>{
            let inName=this.$fenceNode.GetIn(prop.name)
            if(inName==null && prop.required){
                throw new Error("component \'"+this.$name+"\' need prop \'"+prop.name+"'")
            }
            if(inName!=null){
                if(inName.const){
                    (this as any)[prop.origin]=inName.value
                }else{
                    Object.defineProperty(this,prop.origin,{
                        get:()=>{
                            let newvalue=this.$fenceNode.mvvm.$GetExpOrFunValue(inName.value);
                            this.$checkProp(prop,newvalue);
                            return newvalue;
                        }
                    })
                }
            }
        })

        
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

    $Render():DomStatus{
        let doms=this.$treeRoot.Render()
        return doms[0]
    }
    
    $Update(){
        this.$treeRoot.Update()
    }
    $SetStatus(status:VNodeStatus){
        this.$treeRoot.SetStatus(status)
    }
    
    
    $Emit(event:string,...data:any[]){
        if(this.$fenceNode!=null && this.$fenceNode.mvvm!=null){
            let e=this.$outs.find(out=>{
                return out.name==event;
            });
            if(e==null){
                throw new Error("no specified event "+event+" at component "+this.$namespace+"::"+this.$name)
            }
            if(data.length!=e.paramsType.length){
                throw new Error("no specified params "+event+" at component "+this.$namespace+"::"+this.$name)
            }
            for(let i=0;i<e.paramsType.length;i++){
                if(TypeOf(data[i])!=e.paramsType[i]){
                    throw new Error("params expected "+e.paramsType[i]+",but received "+toString.call(data[i])+" at component "+this.$namespace+"::"+this.$name)
                }
            }
            let method=this.$fenceNode.GetOut(event)
            this.$fenceNode.mvvm.$RevokeMethod(method,...data)
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
    $InitOuts():Event[]{
        throw new Error("Method not implemented.");
    }
    $InitTreeroot(): VNode {
        throw new Error("Method not implemented.");
    }
    $GetIns(){
        return this.$ins
    }
}