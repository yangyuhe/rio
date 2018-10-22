import { Mvvm } from "../mvvm/mvvm";
import { VNode } from "./vnode";
import { VNodeStatus } from "../const";
import { DomStatus } from '../models';
import { CustDom } from '../vdom/parser';
export declare class IfNode extends VNode {
    Vdom: CustDom;
    mvvm: Mvvm;
    Parent: VNode;
    private ifExp;
    constructor(Vdom: CustDom, mvvm: Mvvm, Parent: VNode, ifExp: string);
    AttachChildren(): void;
    Render(): DomStatus[];
    Update(): void;
    private reImpletement(newvalue);
    OnDestroy(): void;
    SetStatus(status: VNodeStatus): void;
}
