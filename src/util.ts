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