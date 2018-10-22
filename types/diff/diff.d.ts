export declare function Diff<T>(oldset: T[], newset: T[]): Oper<T>[];
export interface Oper<T> {
    type: "add" | "remove" | "replace";
    newSetIndex?: number;
    oldSetIndex: number;
}
