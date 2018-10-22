import { VNodeStatus } from "../const";
import { DomStatus } from '../models';
import { ComponentMvvm } from '../mvvm/component-mvvm';
import { VNode } from "./vnode";
import { CustDom } from "../vdom/parser";
export declare class SlotNode extends VNode {
    mvvm: ComponentMvvm;
    Parent: VNode;
    private name;
    constructor(vdom: CustDom, mvvm: ComponentMvvm, Parent: VNode, name: string);
    Render(): DomStatus[];
    Update(): void;
    SetStatus(status: VNodeStatus): void;
    OnDestroy(): void;
}
