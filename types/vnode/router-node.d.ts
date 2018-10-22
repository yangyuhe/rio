import { DomStatus } from '../models';
import { Mvvm } from "../mvvm/mvvm";
import { VNode } from "./vnode";
import { CustDom } from '../vdom/parser';
export declare class RouterNode extends VNode {
    Vdom: CustDom;
    mvvm: Mvvm;
    Parent: VNode;
    private routername;
    private lastConstructor;
    constructor(Vdom: CustDom, mvvm: Mvvm, Parent: VNode, routername: string);
    Render(): DomStatus[];
    OnRouterChange(): void;
    private instance(construct);
    Update(): void;
    Reflow(): void;
}
