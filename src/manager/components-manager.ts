import { ComponentMvvmFactoryOption, ComponentOption } from '../models';
import { HttpGet, LogError } from "../util";
import { Parse } from '../vdom/parser';
import { IComponentMvvm } from './../models';
let cssom=require("cssom");

let repository:{[id:string]:ComponentMvvmFactoryOption}={}


export function Id(namespace:string,name:string){
    return namespace+":"+name;
}

export function RegisterComponent(name:string,namespace:string,constructor:IComponentMvvm,option:ComponentOption) {
    let factoryOption:ComponentMvvmFactoryOption={
        $constructor:constructor,
        $preProcess:false,
        $domtree:null,
        $origin:option
    }
    let id=Id(factoryOption.$origin.namespace,factoryOption.$origin.name);
    if(repository[id]!=null)
        throw new Error("component "+id+" already exists")
    repository[id]=factoryOption
}
export function RegisterComponentDirect(option:ComponentMvvmFactoryOption){
    let id=Id(option.$origin.namespace,option.$origin.name);
    if(repository[id]!=null)
        throw new Error("component " + id + " has already exist")
    repository[id]=option
}

export function InitComponent(name: string, namespace: string): IComponentMvvm {
    name = name.toLowerCase()
    namespace = namespace.toLowerCase()
    let factory = repository[Id(namespace,name)]
    if (factory && !factory.$preProcess){
        preProcess(factory)
        factory.$preProcess=true
    }
    if(factory){
        return factory.$constructor
    }else{
        throw new Error("component "+Id(namespace,name)+" not exists")
    }
    
}
export function GetDomTree(name: string, namespace: string){
    name = name.toLowerCase()
    namespace = namespace.toLowerCase()
    let factory = repository[Id(namespace,name)]
    if(factory==null)
        return null
    return factory.$domtree
}
export function IsComponentRegistered(name: string, namespace: string) {
    name = name.toLowerCase()
    namespace = namespace.toLowerCase()
    if (repository[Id(namespace,name)])
        return true
    else
        return false
}
function preProcess(option: ComponentMvvmFactoryOption) {
    //模版
    if (option.$origin.templateUrl != null) {
        option.$origin.template = HttpGet(option.$origin.templateUrl)
        if (option.$origin.template == null) {
            LogError("path " + option.$origin.templateUrl + " not found")
            return
        }
    }

    

    let res=Parse(option.$origin.template);
    if(res.length>1)
        throw new Error(option.$origin.namespace+":"+option.$origin.name+" template should have only one root")
    if(res.length==1)
        option.$domtree = res[0];
    else{
        throw new Error("template should not be empty")
    }
    //样式
    if (option.$origin.styleUrl != null) {
        option.$origin.style = HttpGet(option.$origin.styleUrl)
    }
    if (option.$origin.style != null) {
        let autoGeneratedClass=option.$origin.namespace+"_"+option.$origin.name;
        let topClass=res[0].GetAttr("class");
        res[0].AddClass(autoGeneratedClass);
        let rules=cssom.parse(option.$origin.style);

        let css=transCss(rules.cssRules,autoGeneratedClass,topClass);
        
        
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    
}
function transCss(rules:any[], autoGeneratedClass:string,topClass:string) {
    let css = "";

    rules.forEach((rule: any) => {
        if (topClass == null) {
            css = css + " ." + autoGeneratedClass + " " + rule.cssText;
        } else {
            if ((rule.constructor.name) == "CSSMediaRule") {
                css = css +"@media "+ rule.media.mediaText + "{";
                css = css + transCss(rule.cssRules, autoGeneratedClass, topClass);
                css = css + "}";
            } else {
                let cssTemps = rule.selectorText.split(" ");
                let cssbodyIndex = rule.cssText.indexOf(rule.selectorText);
                let cssbody = rule.cssText.slice(cssbodyIndex + rule.selectorText.length);
                let classesHtml = topClass.split(" ");

                let firstClass = cssTemps[0];
                if(firstClass.indexOf("#")!=0){
                    if (firstClass.indexOf(".") == 0)
                        firstClass = firstClass.substring(1);
                    if (classesHtml.indexOf(firstClass) != -1) {
                        cssTemps[0] = "." + autoGeneratedClass+cssTemps[0];
                        css = css + cssTemps.join(" ") + cssbody;
                    } else {
                        
                        css = css + "." + autoGeneratedClass + " " + rule.cssText;
                    }
                }else{
                    css = css + " " + rule.cssText;
                }
            }
        }
        css = css + "\n";
    });
    return css;
}
