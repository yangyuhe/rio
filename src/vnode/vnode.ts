import { Mvvm } from '../mvvm/mvvm';
import { StrToEvalstr } from '../util';
import { NewVNode, VDom } from '../vdom/vdom';
import { REG_ATTR, VNodeStatus } from './../const';
import { AppMvvm } from './../mvvm/app-mvvm';
import { ComponentMvvm } from './../mvvm/component-mvvm';
import { ForNode } from './for-node';
export abstract class VNode {
    NodeValue: string
    NodeName: string
    NodeType: number
    /**普通属性 */
    Attrs: { name: string, value: string }[] = []
    
    Children: VNode[] = []
    Dom: Node
    IsTemplate = false
    IsCopy=false

    /**指向生成此节点的for节点 */
    Source:ForNode
    
    protected status:VNodeStatus=VNodeStatus.ACTIVE

    constructor(public Vdom:VDom,public mvvm: Mvvm,public Parent:VNode) {
    }
    
    AddProperty(name: string, value: string) {
        if(REG_ATTR.test(name)){
            this.Attrs.push({name:name,value:value})
        }
    }
    
    protected directiveBind(){}
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

            this.directiveBind()
        }
        if (this.NodeType == 3) {
            this.Dom = document.createTextNode(this.NodeValue)
            
            let evalexp=StrToEvalstr(this.NodeValue)
            if (!evalexp.isconst) {
                this.mvvm.$Watch(this,evalexp.exp,(newvalue, oldvalue)=>{
                    this.Dom.textContent = newvalue
                })
            }else{
                this.Dom.textContent=evalexp.exp
            }
        }
        if(this.NodeType==8){
            this.Dom=document.createComment(this.NodeValue)
        }
        if(this.NodeType==1 ||this.NodeType==3 ||this.NodeType==8)
            if(this.Parent && this.Parent.Dom)
                this.Parent.Dom.appendChild(this.Dom)
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
            let evalexp=StrToEvalstr(this.NodeValue)
            if (!evalexp.isconst) {
                this.Dom.textContent=this.mvvm.$GetExpValue(evalexp.exp)
            }else{
                this.Dom.textContent=evalexp.exp
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
    OnRouterChange(){
        this.Children.forEach(child=>child.OnRouterChange())
    }
    NavigateTo(url:string):void{
        if(this.mvvm.$IsRoot()){
            (this.mvvm as AppMvvm).$NavigateTo(url)
        }else{
            if(this.Parent!=null)
                this.Parent.NavigateTo(url)
            else{
                (this.mvvm as ComponentMvvm).$GetFenceNode().NavigateTo(url)
            }
        }
    }
}