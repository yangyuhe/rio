import { DomStatus } from "../models";
import { Mvvm } from "../mvvm/mvvm";
import { CustDom } from "../vdom/parser";
import { VNode } from './vnode';
export declare class VinallaNode extends VNode {
    Vdom: CustDom;
    mvvm: Mvvm;
    Parent: VNode;
    private directives;
    private innerDirective;
    private isAnchor;
    private anchorName;
    /**普通属性 */
    protected attrs: {
        name: string;
        value: string;
    }[];
    constructor(Vdom: CustDom, mvvm: Mvvm, Parent: VNode);
    OnDestroy(): void;
    protected directiveBind(): void;
    /**先渲染自己，再渲染孩子并把孩子返回的dom添加到自己的dom的孩子中 */
    Render(): DomStatus[];
    /**根据孩子节点的dom状态刷新自己的dom节点 */
    Refresh(): void;
    Update(): void;
    Reflow(): void;
    GetAnchor(name: string): VinallaNode;
}
