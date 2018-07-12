import { REG_SINGLE, REG_MULTI ,REG_STR} from "./const";
import { ParamType } from "./models";

export function LogError(msg:any){
    console.error(msg)
}
export function LogInfo(msg:any){
    console.log(msg)
}
export function GetNS(str:string):{namespace:string,value:string}{
    let res=str.split(":")
    if(res.length==1)
        return {namespace:null,value:res[0]}
    return {namespace:res[0],value:res.slice(1).join(":")}
}
export function HttpGet(url:string):string{
    let xhr=new XMLHttpRequest()
    xhr.open("GET",url,false)
    xhr.send()
    if(xhr.readyState==4 && xhr.status==200)
        return xhr.responseText
    else
        return null
}
export function IsStringEmpty(str:string){
    if(str==null)
        return true
    str=str.trim()
    if(str=="")
        return true
    return false
}
export function Trim(str:string,char:string){
    if(char.length>1)
        throw new Error("only receve one character")
    let start=-1
    while(str[start+1]==char){
        start++
    }
    let end=str.length
    while(str[end-1]==char){
        end--
    }
    return str.substring(start+1,end)
}

export function StrToEvalstr(str:string):{isconst:boolean,exp:string}{
    if (REG_SINGLE.test(str)) {
        return {isconst:false,exp:RegExp.$1}
    }else{
        if(REG_MULTI.test(str)){
            let reg=/\{\{([^\{\}]*)\}\}/g
            let res=reg.exec(str)
            let exp=""
            let lastindex=0
            while(res){
                if(res.index!=lastindex){
                    exp+="\'"+str.substring(lastindex,res.index)+"\'+"
                }
                lastindex=res.index+res[0].length
                exp+="("+RegExp.$1+")+"
                res=reg.exec(str)
            }
            if(lastindex!=str.length){
                exp+="'"+str.substr(lastindex)+"'"
            }
            if(exp.endsWith("+")){
                exp=exp.substring(0,exp.length-1)
            }

            return {isconst:false,exp:exp}
        }else{
            return {isconst:true,exp:str}
        }
    }
}

export function InsertDomChild(parent:Node,child:Node,after:Node){
    if(after==null){
        if(parent.firstChild!=null)
            parent.insertBefore(child,parent.firstChild)
        else
            parent.appendChild(child)
    }else{
        if(after.nextSibling!=null)
            parent.insertBefore(child,after.nextSibling)
        else
            parent.appendChild(child)
    }
}

export function TypeOf(param:any):ParamType{
    if(toString.call(param)=="[object Boolean]"){
        return "boolean"
    }
    if(toString.call(param)=="[object Array]"){
        return "array"
    }
    if(toString.call(param)=="[object Number]"){
        return "number"
    }
    if(toString.call(param)=="[object Object]"){
        return "object"
    }
    if(toString.call(param)=="[object Null]"){
        return "object"
    }
    if(toString.call(param)=="[object String]"){
        return "string"
    }
    if(toString.call(param)=="[object Undefined]"){
        throw new Error("function TypeOf: undefined is not allowed")
    }
}
/**解析传入r-class或者r-style的值为json对象 */
export function ParseStyle(style:string){
    style=style.substr(1);
    style=style.substr(0,style.length-1);
    let styles=style.split(",");
    let json:{[key:string]:string}={};
    styles.forEach(s=>{
        let index=s.indexOf(":");
        let key=s.substr(0,index);
        if(REG_STR.test(key)){
            key=RegExp.$2;
        }
        json[key]=s.substr(index+1);
    })
    return json;
}