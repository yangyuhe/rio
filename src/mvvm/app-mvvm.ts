import { NotifyUrlChange } from '../router/router-manager';
import { VNode } from '../vnode/vnode';
import { Mvvm } from './mvvm';
export class AppMvvm extends Mvvm{
    protected $el:string=""

    $NavigateTo(url:string){
        window.history.replaceState(null,null,url)
        NotifyUrlChange()
    }
    $Render(): Node {
        this.$treeRoot.Render()
        return this.$treeRoot.Dom
    }
    $RevokeMethod(method: string, ...params: any[]): void {
        if(typeof (this as any)[method]=="function")
            (this as any)[method].apply(this,params)
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