import { DomStatus, State } from '../models';
import { VNode } from '../vnode/vnode';
import { Mvvm } from './mvvm';
export class AppMvvm extends Mvvm{
    protected $el:string=""
    
    
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

    $DecoratorStates():State[]{
        throw new Error("Method not implemented.");   
    }
}