import { IComponentMvvm } from './../models';
import { VNode } from '../vnode/vnode';
import { SetActiveRouter } from './router-state';
import { RefreshApp } from '../manager/start';
import { LogError, Trim } from '../util';


let matchedRouter:InnerRouter[]=[]

let appRouters:InnerRouter[]=[]
let cursor:number=0;
let firstVNode:VNode=null

/*注册路由*/
export function RegisterRouter(routers:Router[]){
    //将Router转换成InnerRouter
    checkRouter(routers)
    
    routers.forEach(router=>{
        appRouters.push(copyRouter(null,router))
    })
}
/**输入合法性检查*/
function checkRouter(routers:Router[]){
    routers.forEach(router=>{
        router.children=router.children?router.children:[]
        
        if(router.url!=null)
            router.url=Trim(router.url.trim(),"/","right");
        if(router.redirect==null && (router.url==null || router.url=="")){
            throw new Error("must specify url in router")
        }
        router.params=router.params?router.params:[];
        if(router.redirect==null){
            if(router.url.indexOf("/")!=0)
                router.url= "/"+router.url;
        }
        checkRouter(router.children)
    });
}
/**将Router转换成InnerRouter */
function copyRouter(parent:InnerRouter,router:Router):InnerRouter{
    let r:InnerRouter= {
        url:router.url,
        component:router.component,
        components:router.components,
        children:[],
        parent:parent,
        fullUrl:"",
        params:router.params,
        redirect:router.redirect
    }
    if(parent!=null){
        if(router.redirect!=null)
            r.redirect=parent.fullUrl+router.redirect;  
        else  
            r.fullUrl=parent.fullUrl+router.url;
    }else{
        r.fullUrl=router.url;
    }
    for(let i=0;i<router.children.length;i++){
        r.children.push(copyRouter(r,router.children[i]))
    }
    return r
}
/**
 * matchtype 0 完全匹配  1 matchedRouter是当前location的前缀  2 不匹配
 */
function matchRouter(matchedRouter:InnerRouter):{matchtype:number,params:{name:string,value:string}[]}{
    let vinallaUrl=location.pathname
    vinallaUrl=Trim(vinallaUrl,"/","right");
    let vinallaSlice=vinallaUrl.split("/");
    let matchedSlice=matchedRouter.fullUrl.split("/");
    let params:{name:string,value:string}[]=[];
    for(var j=0;j<matchedSlice.length;j++){
        if(vinallaSlice.length-1<j){
            return {matchtype:2,params:[]};
        }
        if(/^\:(\w+)$/.test(matchedSlice[j]) ){
            let name=RegExp.$1
            params.push({name:name,value:vinallaSlice[j]})
            continue;
        }
        if(matchedSlice[j]==vinallaSlice[j]){
            continue;
        }
        return {matchtype:2,params:[]};
    }
    
    let requireParams=matchedRouter.params;
    let searchParams=getSearchParams();
    params=params.concat(searchParams);
    requireParams.forEach(rp=>{
        let exist=params.find(p=>p.name==rp.name);
        if(exist==null && rp.required){
            throw new Error("router match failed,no matched params:"+rp.name);
        }
    })
    if(j==vinallaSlice.length){
        return {matchtype:0,params:params};
    }else{
        return {matchtype:1,params:params};
    }
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


let matchcounter=0;
export function StartMatchUrl(routers?:InnerRouter[]):boolean{
    if(matchcounter>10){
        throw new Error("circular router match");
    }
    if(routers==null){
        routers=appRouters;
    }
    if(routers==appRouters){
        matchcounter++;
        matchedRouter=[];
    }
        
    for(let i=0;i<routers.length;i++){
        let router=routers[i];
        if(router.redirect!=null){
            SetActiveRouter(location.pathname,[]);
            window.history.replaceState(null,"",router.redirect);
            StartMatchUrl(appRouters);
            return true;
        }
        let res=matchRouter(router);
        if(res.matchtype==2){
            continue;
        }
        if(res.matchtype==1){
            if(router.component!=null || router.components!=null)
                matchedRouter.push(router);
            let find=StartMatchUrl(router.children);
            if(find){
                return true;
            }
            continue;
        }
        if(res.matchtype==0){
            SetActiveRouter(location.pathname,res.params);
            if(router.component!=null || router.components!=null)
                matchedRouter.push(router);
            return true;
        }
    }
    return false;
}
export function NextRouter(vnode:VNode,name?:string):IComponentMvvm{
    if(appRouters==null){
        throw new Error("no router specified")
    }
    if(cursor==0){
        firstVNode=vnode
    }
    if(cursor<matchedRouter.length){
        let component=name?matchedRouter[cursor].components[name]:matchedRouter[cursor].component;
        if(component==null){
            throw new Error("component in router be null?");
        }
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

export interface Router{
    url?:string
    component?: IComponentMvvm
    components?:{[name:string]:IComponentMvvm}
    children?:Router[]
    params?:{name:string,required:boolean}[],
    redirect?:string
}
interface InnerRouter extends Router{
    parent:InnerRouter
    children:InnerRouter[]
    fullUrl:string
}

export function NotifyUrlChange(){
    setTimeout(() => {
        matchcounter=0;
        let matched=StartMatchUrl();
        if(!matched){
            throw new Error("no matched router");
        }
        firstVNode.OnRouterChange()
        RefreshApp()
    }, 0);
    
}


