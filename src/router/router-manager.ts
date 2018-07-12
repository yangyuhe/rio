import { VNode } from '../vnode/vnode';
import { SetActiveRouter } from './router-state';
import { RefreshApp } from '../manager/start';
import { LogError } from '../util';


let matchedRouter:InnerRouter[]=[]

let appRouters:InnerRouter[]=[]
let cursor:number=-1
let firstVNode:VNode=null

/*注册路由*/
export function RegisterRouter(routers:Router[]){
    //将Router转换成InnerRouter
    checkRouter(routers)
    routers.forEach(router=>{
        router.urls=router.urls.map(url=>{
            if(url.indexOf("/")!=0)
                return "/"+url
            else
                return url
        })
    })
    routers.forEach(router=>{
        appRouters.push(copyRouter(null,router))
    })
}
/**输入合法性检查*/
function checkRouter(routers:Router[]){
    routers.forEach(router=>{
        router.children=router.children?router.children:[]
        if(router.redirect!=null){
            router.component=""
            router.url=""
        }
        if(router.component==null && router.components==null){
            throw new Error("must specify component or components in router")
        }
        if(router.url==null && router.urls==null){
            throw new Error("must specify url or urls in router")
        }
        router.params=router.params?router.params:[]
        router.urls=router.urls?router.urls:[]
        if(router.url!=null)
            router.urls.push(router.url)
        checkRouter(router.children)
    })
}
/**将Router转换成InnerRouter */
function copyRouter(parent:InnerRouter,router:Router):InnerRouter{
    let r:InnerRouter= {
        urls:router.urls,
        component:router.component,
        components:router.components,
        children:[],
        parent:parent,
        fullUrls:[],
        params:router.params,
        redirect:router.redirect,
        marked:false
    }
    if(parent!=null){
        r.urls.forEach(url=>{
            parent.fullUrls.forEach(fullurl=>{
                if(url.indexOf("/")==0){
                    r.fullUrls.push(url)
                }else{
                    if(url=="")
                        r.fullUrls.push(fullurl)
                    else
                        r.fullUrls.push(fullurl+"/"+url)
                }
            })
        })
    }else{
        r.urls.forEach(url=>r.fullUrls.push(url))
    }
    for(let i=0;i<router.children.length;i++){
        r.children.push(copyRouter(r,router.children[i]))
    }
    return r
}
function matchRouter(matchedRouter:InnerRouter):{name:string,value:string}[]{
    let vinallaUrl=location.pathname
    while(vinallaUrl.endsWith("/")){
        vinallaUrl=vinallaUrl.substr(0,vinallaUrl.length-1)
    }
    let vinallaSlice=vinallaUrl.split("/");
    for(let i=0;i<matchedRouter.fullUrls.length;i++){
        let matchedUrl=matchedRouter.fullUrls[i];
        let matchedSlice=matchedUrl.split("/");
        if(vinallaSlice.length!=matchedSlice.length)
            continue;
        let params:{name:string,value:string}[]=[];
        for(var j=0;j<matchedSlice.length;j++){
            if(/^\:(\w+)$/.test(matchedSlice[j]) ){
                if(vinallaSlice[j]!=""){
                    let name=RegExp.$1
                    params.push({name:name,value:vinallaSlice[j]})
                    continue;
                }else{
                    break
                }
            }
            if(matchedSlice[j]==vinallaSlice[j]){
                continue;
            }
            break;
        }
        if(j==matchedSlice.length){
            let requireParams=matchedRouter.params;
            let searchParams=getSearchParams();
            params=params.concat(searchParams);
            requireParams.forEach(rp=>{
                let exist=params.find(p=>p.name==rp.name);
                if(exist==null && rp.required){
                    throw new Error("router match failed,no matched params:"+rp.name);
                }
            })
            return params;
        }
    }
    return null;
}
function getSearchParams():{name:string,value:string}[]{
    let searchSlice=location.search.split("?")
    let res:{name:string,value:string}[]=[]
    if(searchSlice.length==2){
        let params=searchSlice[1].split("&")
        params.forEach(p=>{
            let name_value=p.split("=")
            if(name_value.length==2){
                res.push({name:name_value[0],value:name_value[1]})
            }
        })
    }
    return res
}
function getLeaf(router:InnerRouter):InnerRouter[]{
    if(router.marked)
        return []
    if(router.children.length==0){
        router.marked=true
        return [router];
    }
    
    let res:InnerRouter[]=[]
    router.children.forEach(child=>{
        res=res.concat(getLeaf(child))
    })
    if(res.length==0){
        router.marked=true
        return [router];
    }
    return res
}
function clearMark(router:InnerRouter){
    router.children.forEach(child=>{
        clearMark(child)
    })
    router.marked=false
}
function matchUrl(){
    appRouters.forEach(r=>clearMark(r))

    let routers:InnerRouter[]=[]

    while(true){
        let res:InnerRouter[]=[]
        appRouters.forEach(r=>{
            res=res.concat(getLeaf(r))
        })
        if(res.length==0){
            break
        }else{
            routers=routers.concat(res)
        }
    }

    let redirect=false
    for(let i=0;i<routers.length;i++){
        let router=routers[i]
        if(router.redirect!=null){
            window.history.replaceState(null,"",router.redirect)
            redirect=true
            break
        }
        let params=matchRouter(router)
        if(params!=null){
            SetActiveRouter(location.pathname,params)
            matchedRouter=[router]
            let parent=router.parent
            while(parent!=null){
                matchedRouter.unshift(parent)
                parent=parent.parent
            }
            break
        }
    }
    if(redirect){
        matchUrl()
    }
}
export function NextRouter(vnode:VNode,name?:string):string{
    if(appRouters==null){
        throw new Error("no router specified")
    }
    if(cursor==-1){
        matchUrl()
        firstVNode=vnode
        cursor=0
    }
    if(cursor<matchedRouter.length){
        let component=name?matchedRouter[cursor].components[name]:matchedRouter[cursor].component
        cursor++
        return component
    }else{
        LogError("router match wrong")
        return null;
    }
    
}
export function MoveBack(){
    cursor--
}
export interface Router extends _Router{
    url?: string
}
export interface _Router{
    urls?:string[]
    component?: string
    components?:{[name:string]:string}
    children?:Router[]
    params?:{name:string,required:boolean}[],
    redirect?:string
}
interface InnerRouter extends _Router{
    parent:InnerRouter
    children:InnerRouter[]
    fullUrls:string[],
    marked:boolean
}

export function NotifyUrlChange(){
    matchUrl()
    firstVNode.OnRouterChange()
    RefreshApp()
}


