import { DomStatus, State } from '../models';
import { VNode } from '../vnode/vnode';
import { Mvvm } from './mvvm';
export declare class AppMvvm extends Mvvm {
    protected $el: string;
    $Render(): DomStatus;
    $InitNamespace(): string;
    $InitDataItems(): {
        name: string;
        value: any;
    }[];
    $InitComputeItems(): {
        name: string;
        get: () => any;
    }[];
    $InitTreeroot(): VNode;
    $InitEl(): string;
    $DecoratorStates(): State[];
}
