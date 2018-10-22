import { IDirectiveConstructor } from "../models";
export declare function RegisterDirective(name: string, namespace: string, constructor: IDirectiveConstructor): void;
export declare function GetDirectiveCon(name: string, namespace: string): IDirectiveConstructor;
export declare function IsDirectiveRegistered(name: string, namespace: string): boolean;
