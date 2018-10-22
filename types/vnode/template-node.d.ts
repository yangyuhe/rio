import { DomStatus } from '../models';
import { VNode } from "./vnode";
export declare class TemplateNode extends VNode {
    Render(): DomStatus[];
    Update(): void;
}
