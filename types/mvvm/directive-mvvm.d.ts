import { OnDataChange, Prop } from "../models";
import { NoticeCallback } from "../observer/notice-center";
import { VinallaNode } from './../vnode/vinalla-node';
import { Mvvm } from "./mvvm";
import { IEvalable } from "../observer/IEvalable";
export declare class DirectiveMVVM implements IEvalable {
    $Name: string;
    $element: HTMLElement;
    $Ins: Prop[];
    $Outs: string[];
    $InitFuncs: string[];
    $MountFuncs: string[];
    $DestroyFuncs: string[];
    $vnode: VinallaNode;
    $mvvm: Mvvm;
    $Initialize(vnode: VinallaNode): void;
    $OnDestroy(): void;
    $Render(): void;
    private $checkProp(prop, value);
    $Watch(exp: string | Function, listener: OnDataChange, watchingArrayItem?: boolean): void;
    $GetExpOrFunValue(expOrFunc: string | Function): any;
    /**注册消息 */
    $on(notice: string, cb: NoticeCallback): void;
    /**触发消息 */
    $broadcast(notice: string, ...params: any[]): void;
    /**动态添加节点 */
    $AddFragment(html: string, anchor: string): void;
}
