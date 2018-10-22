import { Parser } from "htmlparser2";

/**自定义dom对象，区别于js原生dom对象 */
export class CustDom {
    /**标签名 当type='element'时有意义*/
    Name: string=""
    /**文本值 当type='text'时有意义 */
    Text: string=""
    /**属性 */
    Attrs: { Name: string, Value: string }[]=[]
    /**标签类型 目前支持元素，文本和备注三种类型 */
    Type: "element" | "text" | "comment"="element"
    /**孩子dom */
    Children: CustDom[]=[]
    /**父级dom 如果有的话 */
    parent:CustDom=null
    constructor(name:string,text:string,type:"element" | "text" | "comment",attr:{ Name: string, Value: string }[],children:CustDom[],parent:CustDom){
        this.Name=name;
        this.Type=type;
        this.Attrs=attr;
        this.Children=children;
        this.parent=parent;
        this.Text=text;
    }
    GetAttr(name:string){
        let res=this.Attrs.find(attr=>attr.Name==name);
        if(res!=null)
            return res.Value;
        else
            return null;
    }
    AddClass(classname:string){
        let attr=this.Attrs.find(item=>item.Name=="class");
        if(attr==null){
            this.Attrs.push({Name:"class",Value:classname});
        }else{
            attr.Value+=" "+classname;
        }
    }
}
/**当前正在生成的dom树 */
let document:CustDom[]=[];
/**作为正在遍历的节点的父级节点 */
let cursor:CustDom=null;
/**遍历visitor，实现自定义dom树的创建 */
let parser = new Parser({
    onopentag: function (name, attr) {
        let attrs: { Name: string, Value: string }[] = [];
        for (let key in attr) {
            attrs.push({ Name: key, Value: attr[key] });
        }
        let node=new CustDom(name,"","element",attrs,[],cursor);
        
        if (cursor == null) {
            cursor=node;
            document.push(cursor);
        }else{
            cursor.Children.push(node);
            cursor=node;
        }
    },
    onclosetag:function(name){
        cursor=cursor.parent;
    },
    ontext:function(text){
        let node=new CustDom("",text,"text",[],[],cursor);
        
        if (cursor == null) {
            document.push(node);
        }else{
            cursor.Children.push(node);
        }
    },
    onend:function(){
        document=[];
    },
    onreset:function(){
        document=[];
    }
},{
    recognizeSelfClosing:true,
    decodeEntities:true
});

/**解析和生成一个自定义节点树 */
export function Parse(html:string){
    html=html.trim();
    parser.reset();
    parser.write(html);
    return document;
}
