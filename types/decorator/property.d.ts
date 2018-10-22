import { ParamType, Prop, State } from './../models';
export declare function Reactive(target: any, key: string): void;
export declare function Computed(target: any, key: string, descriptor: PropertyDescriptor): void;
export declare function Prop(name: string, required: boolean, type?: ParamType): (target: any, key: string) => void;
export declare function State(name: string, type?: ParamType): (target: any, key: string) => void;
export declare function OnInit(target: any, key: string, descriptor: PropertyDescriptor): void;
export declare function OnMount(target: any, key: string, descriptor: PropertyDescriptor): void;
export declare function OnDestroy(target: any, key: string, descriptor: PropertyDescriptor): void;
export declare function FetchProperty(): {
    computes: {
        name: string;
        get: () => any;
    }[];
    props: Prop[];
    states: State[];
    initFuncs: string[];
    mountFuncs: string[];
    destroyFuncs: string[];
    datas: string[];
};
