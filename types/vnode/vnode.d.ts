import { Mvvm } from '../mvvm/mvvm';
import { DomType, VNodeStatus } from '../const';
import { DomStatus } from '../models';
import { VinallaNode } from './vinalla-node';
import { CustDom } from '../vdom/parser';
import { IONode } from './io-node';
export declare abstract class VNode extends IONode {
    Vdom: CustDom;
    mvvm: Mvvm;
    Parent: VNode;
    protected nodeValue: string;
    protected nodeName: string;
    protected nodeType: "element" | "text" | "comment";
    Children: VNode[];
    statefulDom: {
        type: DomType;
        dom: Node;
    }[];
    protected status: VNodeStatus;
    constructor(Vdom: CustDom, mvvm: Mvvm, Parent: VNode);
    abstract Render(): DomStatus[];
    Reflow(): void;
    Refresh(): void;
    abstract Update(): void;
    OnDestroy(): void;
    AttachChildren(): void;
    SetStatus(status: VNodeStatus): void;
    GetStatus(): VNodeStatus;
    OnRouterChange(): void;
    GetNodeName(): string;
    GetAnchor(name: string): VinallaNode;
    OnMount(): void;
    OnNextTick(): void;
}
