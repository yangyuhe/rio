import { VNode } from "../vnode/vnode";
export declare type NoticeCallback = (...params: any[]) => void;
export declare function RegisterNotice(notice: string, vnode: VNode, cb: NoticeCallback): void;
export declare function RevokeNotice(notice: string, ...params: any[]): void;
