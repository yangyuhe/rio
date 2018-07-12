import { Start } from "./manager/start";


export {Component} from "./decorator/component";
export {App} from "./decorator/app";
export {Reactive,Computed,Prop,OnInit,OnDestroy,OnMount} from "./decorator/property";
export {Directive} from "./decorator/directive"

export {ComponentMvvm} from "./mvvm/component-mvvm"
export {AppMvvm} from "./mvvm/app-mvvm"
export {DirectiveMVVM} from "./mvvm/directive-mvvm"

export {RegisterRouter} from "./router/router-manager"

document.addEventListener("DOMContentLoaded", function () {
    Start()
})


