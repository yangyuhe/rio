import { OnDataChange } from './../models';
import "./redefine-array"
declare let EvalSingle:(context:any,exp:string)=>any
export class WatchNode {
    constructor(private name:string,public Data:any,private watchTree:WatchTree){}
    private listeners:{exp:string,cb:OnDataChange,value:any}[]=[]
    private children:WatchNode[] = []
    

    ExploreExp(exp:string):WatchNode{
        return this.exploreExp(exp)
    }
    private exploreExp(exp:string) :WatchNode{
        if (exp=="")
            return this
        let steps = exp.split(".")
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].name == steps[0]) {
                if(steps.length==1)
                    return this.children[i]
                else{
                    let subexp=steps.slice(1).join(".")
                    return this.children[i].exploreExp(subexp)
                }
            }
        }
        let newnode = new WatchNode(steps[0],this.Data[steps[0]],this.watchTree)
        newnode.defineReactive(this.Data)
        this.children.push(newnode)
        if(steps.length==1){
            return newnode
        }else{
            let subexp=steps.slice(1).join(".")
            return newnode.exploreExp(subexp)
        }
    }
    AddListener(listener:{cb:OnDataChange,exp:string,value:any}){
        this.listeners.push(listener)
    }
    RemoveListener(cb:OnDataChange){
        this.listeners=this.listeners.filter(l=>l.cb!=cb)
    }
    private checkDirty(){
        this.listeners.forEach(listener=>{
            let newvalue=this.watchTree.GetValue(listener.exp)
            if(newvalue!=listener.value){
                listener.cb(newvalue,listener.value)
                listener.value=newvalue
            }
        })
    }
    private defineReactive(data:any) {
        var value = data[this.name]
        if(value!=this.Data){
            this.checkDirty()
            this.Data=value
        }
        if(this.name=="length" && toString.call(data)=="[object Array]"){
            data.$onLengthChange=()=>{
                this.listeners.forEach(this.checkDirty.bind(this))
            }
        }else{
            Object.defineProperty(data, this.name, {
                get: ()=> {
                    return this.Data
                },
                set: (newval)=>{
                    if (newval != this.Data) {
                        this.Data=newval 
                        this.listeners.forEach(this.checkDirty.bind(this))
                        this.children.forEach(child=>{
                            child.defineReactive(newval)
                        })
                    }
                }
            })
        }
    }
}
export class WatchTree{
    private root:WatchNode
    constructor(data:any){
        this.root=new WatchNode("",data,this)
    }
    GetValue(exp:string){
        return EvalSingle(this.root.Data,exp)
    }
    private transformArray(exp:string){
        let res=""
        let steps=exp.split(".")
        steps.forEach(step=>{
            if(res!="")
                res+="."
            if(/^(\w+)\[(\w+)\]$/.test(step)){
                res+=RegExp.$1+"."+RegExp.$2
            }else{
                res+=step
            }
        })
        return res
    }
    AddListener(exp:string,fullExp:string,cb:OnDataChange){
        let res=this.transformArray(exp)
        let node=this.root.ExploreExp(res)
        node.AddListener({
            cb:cb,
            value:this.GetValue(exp),
            exp:fullExp
        })
    }
    RemoveListener(exp:string,cb:OnDataChange){
        let res=this.transformArray(exp)
        let node=this.root.ExploreExp(res)
        node.RemoveListener(cb)
    }
}
