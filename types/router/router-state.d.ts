import { RouterInfo, RouterChangeCallback } from './../models';
import { VNode } from '../vnode/vnode';
export declare function SetActiveRouter(path: string, params: {
    name: string;
    value: any;
}[]): void;
export declare function GetActiveRouter(): {
    active: RouterInfo;
    previous: RouterInfo;
};
export declare function WatchRouterChange(vnode: VNode, listener: RouterChangeCallback): void;
