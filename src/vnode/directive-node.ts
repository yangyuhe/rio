import { REG_IN, REG_OUT } from '../const';
import { CustDom } from '../vdom/parser';

export class DirectiveNode {
    //输入与输出值
    protected ins_pure: { [name: string]: any } = {}
    protected ins_exp: { [name: string]: string } = {}
    protected outs: { [name: string]: string } = {}

    constructor(private vdom:CustDom) {
        this.vdom.Attrs.forEach(attr=>{
            this.addProperty(attr.Name,attr.Value)
        })
    }
    private addProperty(name: string, value: string):boolean{
        //输入
        if(REG_IN.test(name)){
            this.ins_exp[RegExp.$1]=value
            return
        }
        //输出
        if(REG_OUT.test(name) ){
            this.outs[RegExp.$1]=value
            return
        }
        this.ins_pure[name]=value
        return
    }
    GetIn(prop:string){
        if(this.ins_pure[prop]!=null)
            return {value:this.ins_pure[prop],const:true} 
        if(this.ins_exp[prop]!=null)
            return {value:this.ins_exp[prop],const:false}

        return null
    }
    GetOut(prop:string){
        return this.outs[prop]
    }
}