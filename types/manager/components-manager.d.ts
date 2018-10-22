import { ComponentMvvmFactoryOption, ComponentOption } from '../models';
import { IComponentMvvm } from './../models';
import { CustDom } from "../vdom/parser";
export declare function Id(namespace: string, name: string): string;
export declare function RegisterComponent(name: string, namespace: string, constructor: IComponentMvvm, option: ComponentOption): void;
export declare function RegisterComponentDirect(option: ComponentMvvmFactoryOption): void;
export declare function InitComponent(name: string, namespace: string): IComponentMvvm;
export declare function GetDomTree(name: string, namespace: string): CustDom;
export declare function IsComponentRegistered(name: string, namespace: string): boolean;
