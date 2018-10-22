import { OnDataChange } from "../models";
import { Mvvm } from "./mvvm";
import { DirectiveMVVM } from "./directive-mvvm";
export interface StateManipulate<T> {
    send(data: T): void;
    value(): T;
    subscribe(mvvm: Mvvm | DirectiveMVVM, exp: string | Function, listener: OnDataChange): void;
}
export declare function CreateState<T>(property: string, data: T): StateManipulate<T>;
export declare function GetGlobalState(property: string): any;
