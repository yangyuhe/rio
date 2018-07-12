import { RegisterDirective } from "../manager/directive-manager";
import { DirectiveOption, IDirectiveConstructor } from "../models";
import { FetchProperty } from "./property";

export function Directive(option:DirectiveOption){
    checkDirectiveOption(option)
    let res=FetchProperty()
    return function(target:IDirectiveConstructor){
        let constructor= class $DirectiveMvvm extends target{
            $Name=option.name
            $Namespace=option.namespace
            $Ins=res.props
            $Out=option.events
            $InitFuncs=res.initFuncs
            $MountFuncs=res.mountFuncs
            $DestroyFuncs=res.destroyFuncs
        }
        RegisterDirective(option.name,option.namespace,constructor)
    }
}
function checkDirectiveOption(option:DirectiveOption){
    option.events=option.events?option.events:[]
    option.namespace=option.namespace?option.namespace:"default"
}