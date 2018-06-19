import { VNode } from '../vnode/vnode';


let paths:string[]=[]
let vnodes:VNode[]=[]

let root:InnerRouter[]=[]
let cursor:InnerRouter=null
let firstVNode:VNode=null
export function RegisterRouter(routers:Router[]){
    checkRouter(routers)
    routers.forEach(router=>{
        root.push(copyRouter(null,router))
    })
}
function checkRouter(routers:Router[]){
    routers.forEach(router=>{
        router.children=router.children?router.children:[]
        if(router.component==null && router.components==null){
            throw new Error("must specify component or components in router")
        }
        if(router.url==null && router.urls==null){
            throw new Error("must specify url or urls in router")
        }
    })
}
function copyRouter(parent:InnerRouter,router:Router):InnerRouter{
    let r:InnerRouter= {
        url:router.url,
        urls:router.urls,
        component:router.component,
        components:router.components,
        children:[],
        parent:parent
    }
    for(let i=0;i<router.children.length;i++){
        r.children.push(copyRouter(r,router.children[i]))
    }
    return r
}
function compireArray(vinallaUrl:string,matchedUrl:string):{indexOf:boolean,params:{name:string,value:string}[]}{
    let vinallaSlice=vinallaUrl.split("/")
    let matchedSlice=matchedUrl.split("/")
    if(vinallaSlice.length<matchedSlice.length)
        return {indexOf:false,params:[]}
    let res:{indexOf:boolean,params:{name:string,value:string}[]}={indexOf:true,params:[]}
    for(let i=0;i<matchedSlice.length;i++){
        if(/^\:(\w+)$/.test(matchedSlice[i])){
            res.params.push({name:RegExp.$1,value:vinallaSlice[i]})
            continue
        }
        if(matchedSlice[i]==vinallaSlice[i]){
            continue
        }
        res.indexOf=false
        res.params=[]
        break
    }
    return res
}
export function GetRouter(vnode:VNode,name?:string):{component:string,params:{name:string,value:string}[]}{
    if(root==null){
        throw new Error("no router specified")
    }
    let location=window.location.pathname
    let tempRouters:InnerRouter[]=[]
    if(cursor==null){
        tempRouters=root
        firstVNode=vnode
    }
    else
        tempRouters=cursor.children
    let url=""
    paths.forEach(path=>url+=path)
    for(let i=0;i<tempRouters.length;i++){
        let urls:string[]=[]
        if(tempRouters[i].url!=null){
            urls.push(tempRouters[i].url)
        }
        if(tempRouters[i].urls!=null){
            urls=urls.concat(tempRouters[i].urls)
        }
        for(let j=0;j<urls.length;j++){
            let res=compireArray(location,url+urls[j])
            if(res.indexOf){
                paths.push(urls[j])
                vnodes.push(vnode)
                cursor=tempRouters[i]
                if(name==null)
                    return {component:tempRouters[i].component,params:res.params}
                else{
                    let com=tempRouters[i].components[name]
                    if(com==null){
                        throw new Error("no specified router view "+name)
                    }
                    return {component:com,params:res.params}
                }
            }
        }
    }
    return null
}

export interface Router {
    url?: string
    urls?:string[]
    component?: string,
    components?:{[name:string]:string}
    children?:Router[]
}
interface InnerRouter extends Router{
    parent:InnerRouter
    children:InnerRouter[]
}

export function NotifyUrlChange(){
    paths=[]
    if(vnodes.length>0)
        vnodes.forEach(node=>node.OnRouterChange())
    else
        firstVNode.OnRouterChange()
}


export function PopPath(){
    paths.pop()
    cursor=cursor.parent
}

