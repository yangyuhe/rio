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
    if(res.length==2)
        return {namespace:res[0],value:res[1]}
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