import { NotifyUrlChange } from '../router/router-manager';
import { VNode } from '../vnode/vnode';
import { Mvvm } from './mvvm';
import { DomStatus } from '../models';
export class AppMvvm extends Mvvm{
    protected $el:string=""
    
    $NavigateTo(url:string){
        window.history.replaceState(null,null,url)
        NotifyUrlChange()
    }
    $Render(): DomStatus {
        let doms=this.$treeRoot.Render()
        return doms[0]
    }
    
    $InitNamespace(): string {
        throw new Error("Method not implemented.");
    }
    $InitDataItems(): {name:string,value:any}[] {
        throw new Error("Method not implemented.");
    }
    $InitComputeItems(): { name: string; get: () => any }[] {
        throw new Error("Method not implemented.");
    }

    $InitTreeroot(): VNode {
        throw new Error("Method not implemented.");
    }
    $InitEl():string{
        throw new Error("Method not implemented.");
    }
}