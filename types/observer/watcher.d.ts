import { OnDataChange } from './../models';
import { VNode } from './../vnode/vnode';
import { IEvalable } from './IEvalable';
export declare class Watcher {
    private evalable;
    private vnode;
    ExpOrFunc: string | Function;
    private cb;
    private watchingArrayItem;
    private value;
    private oldArray;
    constructor(evalable: IEvalable, vnode: VNode, ExpOrFunc: string | Function, cb: OnDataChange, watchingArrayItem?: boolean);
    private getValue();
    /**用于返回当前缓存的值，主要针对computed */
    GetCurValue(): any;
    GetVNode(): VNode;
    Update(): void;
}
