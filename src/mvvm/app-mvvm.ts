import { NotifyUrlChange } from '../router/router';
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
    $GetNamespace(): string {
        throw new Error("Method not implemented.");
    }
    $GetDataItems(): {name:string,value:any}[] {
        throw new Error("Method not implemented.");
    }
    $GetComputeItems(): { name: string; get: () => any }[] {
        throw new Error("Method not implemented.");
    }

    $GetTreeroot(): VNode {
        throw new Error("Method not implemented.");
    }
    $GetEl():string{
        throw new Error("Method not implemented.");
    }
}