import { DomStatus } from '../models';
import { Mvvm } from "../mvvm/mvvm";
import { VNode } from "./vnode";
import { CustDom } from '../vdom/parser';
export declare class PlugNode extends VNode {
    mvvm: Mvvm;
    Parent: VNode;
    templatename: string;
    constructor(vdom: CustDom, mvvm: Mvvm, Parent: VNode, templatename: string);
    Render(): DomStatus[];
    Update(): void;
}
