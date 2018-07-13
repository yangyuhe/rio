import { VNode } from "../vnode/vnode";
import { VNodeStatus } from "../const";

export type NoticeCallback=(...params:any[])=>void;
let notices:{[notice:string]:{vnode:VNode,cb:NoticeCallback}[]}={};

export function RegisterNotice(notice:string,vnode:VNode,cb:NoticeCallback){
    if(notices[notice]==null)
        notices[notice]=[];
    notices[notice].push({vnode:vnode,cb:cb});

}
export function RevokeNotice(notice:string,...params:any[]){
    if(notices[notice]!=null){
        notices[notice]=notices[notice].filter(item=>{
            return item.vnode.GetStatus()!=VNodeStatus.DEPRECATED;
        });
        notices[notice].forEach(item=>{
            if(item.vnode.GetStatus()==VNodeStatus.ACTIVE){
                item.cb(...params);
            }
        });
    }
}