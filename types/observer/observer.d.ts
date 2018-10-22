import { VNode } from '../vnode/vnode';
import { Watcher } from "./watcher";
import { IEvalable } from './IEvalable';
export declare function SetTarget(target: Watcher): void;
export declare function CleanTarget(): void;
export declare function ReactiveData(data: any): void;
export declare function ReactiveKey(data: any, key: string): void;
export declare function ReactiveComputed(evalable: IEvalable, vnode: VNode, key: string, func: () => any): void;
