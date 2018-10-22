import { IComponentMvvm } from './../models';
import { VNode } from '../vnode/vnode';
export declare function RegisterRouter(routers: Router[]): void;
export declare function StartMatchUrl(routers?: InnerRouter[]): boolean;
export declare function NextRouter(vnode: VNode, name?: string): IComponentMvvm;
export declare function MoveBack(): void;
export interface Router {
    url?: string;
    component?: IComponentMvvm;
    components?: {
        [name: string]: IComponentMvvm;
    };
    children?: Router[];
    params?: {
        name: string;
        required: boolean;
    }[];
    redirect?: string;
}
export interface InnerRouter extends Router {
    parent: InnerRouter;
    children: InnerRouter[];
    fullUrl: string;
}
export declare function NotifyUrlChange(): void;
