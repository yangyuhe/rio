import { VNode } from "../vnode/vnode";
import { Mvvm } from "../mvvm/mvvm";
import { CustDom } from "./parser";
export declare enum Priority {
    NORMAL = 0,
    IF = 1,
    FOR = 2,
}
export declare function NewVNode(dom: CustDom, mvvm: Mvvm, parent: VNode, priority?: Priority): VNode;
