import { VNodeStatus } from "../const";
import { DomStatus } from '../models';
import { Mvvm } from "../mvvm/mvvm";
import { CustDom } from "../vdom/parser";
import { ComponentMvvm } from '../mvvm/component-mvvm';
import { PlugNode } from "./plug-node";
import { VNode } from "./vnode";
export declare class CustomNode extends VNode {
    Vdom: CustDom;
    mvvm: Mvvm;
    Parent: VNode;
    SurroundMvvm: ComponentMvvm;
    /**获取自定义组建上的style 或者r-style属性 */
    private styles;
    /**获取自定义组建上的class 或者r-class属性 */
    private classes;
    constructor(Vdom: CustDom, mvvm: Mvvm, Parent: VNode, SurroundMvvm: ComponentMvvm);
    /**获取跟slot匹配的模版内容 */
    GetTemplate(name: string): PlugNode;
    Render(): DomStatus[];
    AttachChildren(): void;
    GetInValue(prop: string): any;
    Refresh(): void;
    Update(): void;
    OnDestroy(): void;
    SetStatus(status: VNodeStatus): void;
    Reflow(): void;
    OnRouterChange(): void;
    OnMount(): void;
    OnNextTick(): void;
}
