import { ParamType } from "./models";
export declare function LogError(msg: any): void;
export declare function LogInfo(msg: any): void;
export declare function GetNS(str: string): {
    namespace: string;
    value: string;
};
export declare function HttpGet(url: string): string;
export declare function IsStringEmpty(str: string): boolean;
export declare function Trim(str: string, char: string, direction?: "both" | "left" | "right"): string;
export declare function StrToEvalstr(str: string): {
    isconst: boolean;
    exp: string;
};
export declare function InsertDomChild(parent: Node, newChild: Node, after: Node): void;
export declare function TypeOf(param: any): ParamType;
/**解析传入r-class或者r-style的值为json对象 */
export declare function ParseStyle(style: string): {
    [key: string]: string;
};
