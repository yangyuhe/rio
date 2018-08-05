import { Parser } from "htmlparser2";

export class CustDom {
    Name: string=""
    Text: string=""
    Attrs: { Name: string, Value: string }[]=[]
    Type: "element" | "text" | "comment"="element"
    Children: CustDom[]=[]
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
let document:CustDom[]=[];
let cursor:CustDom=null;
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

export function Parse(html:string){
    html=html.trim();
    parser.reset();
    parser.write(html);
    return document;
}
