import { DomStatus, OnDataChange, RouterInfo, State } from '../models';
import { IEvalable } from '../observer/IEvalable';
import { NoticeCallback } from '../observer/notice-center';
import { Watcher } from "../observer/watcher";
import { VNode } from "../vnode/vnode";
export declare abstract class Mvvm implements IEvalable {
    $namespace: string;
    protected $treeRoot: VNode;
    protected $dataItems: {
        name: string;
        value: any;
    }[];
    protected $computeItems: {
        name: string;
        get: () => any;
    }[];
    private $isroot;
    private $states;
    private nextTicksCbs;
    protected readonly $router: {
        active: RouterInfo;
        previous: RouterInfo;
    };
    constructor();
    $initialize(): void;
    $AttachChildren(): void;
    $GetExpOrFunValue(expOrFunc: string | Function): any;
    $ExtendMvvm(): Mvvm;
    $SetValue(exp: string, value: any): void;
    $CreateWatcher(vnode: VNode, exp: string | Function, listener: OnDataChange, watchingArrayItem?: boolean): Watcher;
    $Watch(exp: string | Function, listener: OnDataChange, watchingArrayItem?: boolean): void;
    $OnDestroy(): void;
    $SetRoot(isroot: boolean): void;
    $IsRoot(): boolean;
    $GetDataItems(): {
        name: string;
        value: any;
    }[];
    $GetComputedItems(): {
        name: string;
        get: () => any;
    }[];
    $Refresh(): void;
    $RevokeMethod(method: string, ...params: any[]): void;
    /**动态的增加响应式数据 */
    $AddReactiveData(name: string, value: any): void;
    private getAnchorNode(name);
    GetRef(ref: string): HTMLElement;
    /**动态添加节点 */
    $AddFragment(html: string, anchor: string): void;
    /**注册消息 */
    protected $on(notice: string, cb: NoticeCallback): void;
    /**触发消息 */
    protected $broadcast(notice: string, ...params: any[]): void;
    /**监视路由变化 */
    protected $onRouterChange(callbck: (newrouter: RouterInfo, oldrouter: RouterInfo) => void): void;
    $NavigateTo(url: string): void;
    $OnMount(): void;
    $NoticeNextTickListener(): void;
    $OnNextTick(cb: () => void): void;
    private $checkState(prop, value);
    $GetTreeRoot(): VNode;
    abstract $InitDataItems(): {
        name: string;
        value: any;
    }[];
    abstract $InitComputeItems(): {
        name: string;
        get: (() => any);
    }[];
    abstract $InitNamespace(): string;
    abstract $Render(): DomStatus;
    abstract $InitTreeroot(): VNode;
    abstract $DecoratorStates(): State[];
}
