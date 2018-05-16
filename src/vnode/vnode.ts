import { REG_IN, REG_OUT, REG_STR, REG_ATTR, REG_TEST_OUTPUT, REG_TEST_INPUT, REG_MULTI, VNodeStatus } from './../const';
import { REG_SINGLE } from "../const";
import { DirectiveBind } from "../directive/dir-handler";
import { MVVM } from '../mvvm/mvvm';
import { NewVNode, VDom } from '../vdom/vdom';
import { LogError } from '../util';
export class VNode {
    NodeValue: string
    NodeName: string
    NodeType: number
    /**普通属性 */
    Attrs: { name: string, value: string }[] = []
    /**指令属性 */
    Children: VNode[] = []
    Dom: Node
    IsTemplate = false
    IsCopy=false
    //输入与输出值
    protected ins_pure:{[name:string]:any}={}
    protected ins_exp:{[name:string]:string}={}
    protected outs:{[name:string]:string}={}
    protected status:VNodeStatus=VNodeStatus.ACTIVE

    constructor(public Vdom:VDom,public mvvm: MVVM,public Parent:VNode) {
    }
    
    AddProperty(name: string, value: string) {
        value = value.trim()
        if(REG_IN.test(name)){
            let attr=RegExp.$1
            if(attr=="for" || attr=="if")
                return
            if(!this.testInput(attr)){
                LogError("prop "+attr+" not exist on "+this.NodeName)
                return
            }
            if(REG_STR.test(value))
                this.ins_pure[attr]=RegExp.$2
            else
                this.ins_exp[attr]=value
            return
        }
        if(REG_OUT.test(name)){
            if(!this.testOutput(RegExp.$1)){
                LogError("event "+RegExp.$1+" not exist on "+this.NodeName)
                return
            }
            this.outs[RegExp.$1]=value
            return
        }
        if(REG_ATTR.test(name)){
            this.Attrs.push({name:name,value:value})
        }
    }
    GetOutput(){
        return this.outs
    }
    GetInput(){
        return this.ins_exp
    }
    protected testOutput(name:string):boolean{
        return REG_TEST_OUTPUT.test(name)
    }
    protected testInput(name:string):boolean{
        return REG_TEST_INPUT.test(name)
    }
    
    /**生成虚拟节点代表的dom并把自己加入父亲dom中 */
    Render() :void{
        if (this.NodeType == 1) {
            let dom = document.createElement(this.NodeName)
            this.Attrs.forEach(prop => {
                dom.setAttribute(prop.name, prop.value)
            })
            this.Dom = dom 
            let children:VNode[]=[]
            this.Children.forEach(child => {
                if(!child.IsCopy)
                    children.push(child)
            })
            children.forEach(child => {
                child.Render()
            })
            //todo 设置属性
            DirectiveBind(this)
        }
        if (this.NodeType == 3) {
            this.Dom = document.createTextNode(this.NodeValue)
            
            if (REG_SINGLE.test(this.NodeValue)) {
                this.mvvm.$watchExpOrFunc(this,RegExp.$1,(newvalue, oldvalue)=>{
                    this.Dom.textContent = newvalue
                })
            }else{
                if(REG_MULTI.test(this.NodeValue)){
                    let res=this.multiBindParse(this.NodeValue)
                    this.mvvm.$watchExpOrFunc(this,res,(newvalue, oldvalue)=>{
                        this.Dom.textContent = newvalue
                    })
                }else{
                    this.Dom.textContent=this.NodeValue
                }
            }
        }
        if(this.Parent && this.Parent.Dom)
            this.Parent.Dom.appendChild(this.Dom)
    }
    private multiBindParse(nodevalue:string):string{
        let reg=/\{\{([^\{\}]*)\}\}/g
        let res=reg.exec(nodevalue)
        let exp=""
        let lastindex=0
        while(res){
            if(res.index!=lastindex){
                exp+="\'"+nodevalue.substring(lastindex,res.index)+"\'+"
            }
            lastindex=res.index+res[0].length
            exp+="("+RegExp.$1+")+"
            res=reg.exec(nodevalue)
        }
        if(exp.lastIndexOf("+")==exp.length-1){
            exp=exp.substring(0,exp.length-1)
        }

        return exp
    }
    Update(){
        //todo 更新属性
        if (this.NodeType == 1) {
            let children: VNode[] = []
            this.Children.forEach(child => {
                children.push(child)
            })
            children.forEach(child => {
                child.Update()
            })
            //todo 设置属性
            return
        }
        if (this.NodeType == 3) {
            if (REG_SINGLE.test(this.NodeValue)) {
                this.Dom.textContent=this.mvvm.GetExpValue(RegExp.$1)
            }else{
                if(REG_MULTI.test(this.NodeValue)){
                    let res=this.multiBindParse(this.NodeValue)
                    this.Dom.textContent=this.mvvm.GetExpValue(res)     
                }else{
                    this.Dom.textContent=this.NodeValue
                }
            }
        }
    }
    Refresh() {
        if (this.IsTemplate){
            return
        }
        let allnodes = this.Dom.childNodes
        let allvnodes: VNode[] = []
        this.Children.forEach(child => {
            if (!child.IsTemplate && child.Dom!=null) {
                allvnodes = allvnodes.concat(child)
            }
        })

        let ruler = {
            old_j: -1,
            i: 0,
            j: 0
        }
        let opers: any[] = []
        while (true) {
            if (ruler.i > allnodes.length - 1) {
                break
            }
            if (ruler.j > allvnodes.length - 1) {
                opers.push({
                    type: "remove",
                    node: allnodes[ruler.i]
                })
                ruler.i++
                ruler.j = ruler.old_j + 1
                continue
            }
            if (allnodes[ruler.i] != allvnodes[ruler.j].Dom) {
                ruler.j++
                continue
            }
            if (allnodes[ruler.i] == allvnodes[ruler.j].Dom) {
                if (ruler.i < ruler.j) {
                    let index = ruler.old_j + 1
                    while (index < ruler.j) {
                        opers.push({
                            type: "add",
                            beforeNode: allnodes[ruler.i],
                            node: allvnodes[index].Dom
                        })
                        index++
                    }
                }
                ruler.old_j = ruler.j
                ruler.i++
                ruler.j++
                continue
            }
        }
        while (ruler.j < allvnodes.length) {
            opers.push({
                type: "add",
                beforeNode: null,
                node: allvnodes[ruler.j].Dom
            })
            ruler.j++
        }
        opers.forEach(oper => {
            if (oper.type == "add") {
                if(oper.beforeNode!=null)
                    this.Dom.insertBefore(oper.node, oper.beforeNode)
                else
                    this.Dom.appendChild(oper.node)
            }
            if (oper.type == "remove")
                (oper.node as HTMLElement).remove()
        })
        
    }
    AddChildren(child: VNode, nodes: VNode[],offset:number) {
        for (let i = 0; i < this.Children.length; i++) {
            if (this.Children[i] == child) {
                this.Children.splice(i + 1+offset, 0, ...nodes)
                break
            }
        }
    }
    RemoveChildren(nodes:VNode[]){
        this.Children=this.Children.filter(child=>{
            return nodes.indexOf(child)==-1
        })
    }
    OnRemoved(){
        this.Children.forEach(child=>{
            if(!child.IsCopy)
                child.OnRemoved()
        })
    }
    
    
    /**解析基本信息 */
    protected basicSet(){
        this.NodeValue = this.Vdom.NodeValue
        this.NodeName = this.Vdom.NodeName
        this.NodeType = this.Vdom.NodeType
        //保存元素属性
        for (let i = 0; i < this.Vdom.Attrs.length; i++) {
            this.AddProperty(this.Vdom.Attrs[i].Name,this.Vdom.Attrs[i].Value)
        }
    }
    /**解析自节点信息 */
    protected childSet(){
            //解析子节点
            for (let i = 0; i < this.Vdom.Children.length; i++) {
                let childdom=this.Vdom.Children[i]
                let vchild=NewVNode(childdom,this.mvvm,this)
                
                if(vchild!=null){
                    vchild.AttachDom()
                    this.Children.push(vchild)
                }
            }
    }
    AttachDom() {
        this.basicSet()
        this.childSet()
    }
    SetStatus(status:VNodeStatus){
        this.status=status
        this.Children.forEach(child=>{
            if(!child.IsCopy)
                child.SetStatus(status)
        })
    }
    GetStatus(){
        return this.status
    }
}