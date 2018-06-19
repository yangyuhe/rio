import { IAppMvvm } from './../models';

let apps:IAppMvvm[]=[]

export function RegisterApp(app:IAppMvvm){
    apps.push(app)
}
export function GetApp(){
    return apps
}