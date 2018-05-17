import { REG_IN, REG_OUT } from '../const';
import { VDom } from '../vdom/vdom';
import { DirectiveOption } from './../models';

export class Directive {
    //输入与输出值
    protected ins_pure: { [name: string]: any } = {}
    protected ins_exp: { [name: string]: string } = {}
    protected outs: { [name: string]: string } = {}

    constructor(private vdom:VDom,private directiveOption:DirectiveOption) {
        this.vdom.Attrs.forEach(attr=>{
            this.addProperty(attr.Name,attr.Value)
        })
    }
    private addProperty(name: string, value: string):boolean{
        //输入
        for(let i=0;i<this.directiveOption.props.length;i++){
            let prop=this.directiveOption.props[i]
            
            if(REG_IN.test(name) && prop.name==RegExp.$1){
                this.ins_exp[RegExp.$1]=value
                return
            }else{
                if(prop.name==name){
                    this.ins_pure[name]=value
                    return
                }
            }
        }
        //输出
        for(let i=0;i<this.directiveOption.events.length;i++){
            let event=this.directiveOption.events[i]
            
            if(REG_OUT.test(name) && event==RegExp.$1){
                this.outs[RegExp.$1]=value
                return
            }
        }
    }
    GetIn(prop:string){
        return this.ins_pure[prop] ||this.ins_exp[prop]
    }
    GetOut(prop:string){
        return this.outs[prop]
    }
}