import { DomStatus, Event, Prop, State } from "../models";
import { CustomNode } from "../vnode/custom-node";
import { VNode } from "../vnode/vnode";
import { VNodeStatus } from '../const';
import { Mvvm } from './mvvm';
export declare class ComponentMvvm extends Mvvm {
    private $fenceNode;
    private $name;
    private $fullname;
    private $ins;
    private $outs;
    $initialize(): void;
    private $checkProp(prop, value);
    $Render(): DomStatus;
    $Update(): void;
    $SetStatus(status: VNodeStatus): void;
    $Emit(event: string, ...data: any[]): void;
    $OnRouterChange(): void;
    $GetFenceNode(): CustomNode;
    $SetFenceNode(node: CustomNode): void;
    $InitNamespace(): string;
    $InitDataItems(): {
        name: string;
        value: any;
    }[];
    $InitComputeItems(): {
        name: string;
        get: () => any;
    }[];
    $InitName(): string;
    $InitIns(): Prop[];
    $InitOuts(): Event[];
    $InitTreeroot(): VNode;
    $GetIns(): Prop[];
    $DecoratorStates(): State[];
}
