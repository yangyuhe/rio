import { Depender } from "./observe";

let push=Array.prototype.push;
let splice=Array.prototype.splice;
let pop=Array.prototype.pop;
let shift=Array.prototype.shift;
let unshift=Array.prototype.shift;

let notify=function(obs:Depender[]){
    if(obs!=null)
        obs.forEach(ob=>ob.Notify())
};
(Array.prototype.push as any)=function(){
    let res=push.apply(this,arguments)
    notify(this.$obs)
    return res
};
(Array.prototype.splice as any)=function(){
    let old=this.length
    let res=splice.apply(this,arguments)
    if(this.length!=old){
        notify(this.$obs)
    }
    return res
};
(Array.prototype.pop as any)=function(){
    let res=pop.apply(this,arguments)
    notify(this.$obs)
    return res
};
(Array.prototype.shift as any)=function(){
    let res=shift.apply(this,arguments)
    notify(this.$obs)
    return res
};
(Array.prototype.unshift as any)=function(){
    let res=unshift.apply(this,arguments)
    notify(this.$obs)
    return res
};