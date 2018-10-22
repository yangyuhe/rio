import { VNode } from '../vnode/vnode';
export declare function GetInnerDir(name: string): InnerDirective;
export interface InnerDirective {
    (exp: string, vnode: VNode, options?: string[]): void;
}
