import { VNodeStatus } from "../const";
import { DomStatus } from "../models";
import { Mvvm } from '../mvvm/mvvm';
import { VNode } from "./vnode";
import { CustDom } from "../vdom/parser";
export declare class ForNode extends VNode {
    Vdom: CustDom;
    mvvm: Mvvm;
    Parent: VNode;
    private originForExp;
    private forExp;
    private indexName;
    private arrayExpWatcher;
    constructor(Vdom: CustDom, mvvm: Mvvm, Parent: VNode, originForExp: string);
    private newCopyNode(item);
    private implementForExp(newitems, olditems);
    Update(): void;
    AttachChildren(): void;
    Render(): DomStatus[];
    OnDestroy(): void;
    SetStatus(status: VNodeStatus): void;
}
