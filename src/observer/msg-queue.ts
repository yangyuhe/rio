import { Watcher } from './watcher';

let queue:Watcher[]=[]
let settimeout=false
export function AddWatcher(watcher:Watcher){
    if(queue.indexOf(watcher)==-1)
        queue.push(watcher)
    if(!settimeout){
        settimeout=true
        
        setTimeout(() => {
            RevokeWatcher()
            settimeout=false            
        }, 0);
    }
}
export function RevokeWatcher(){
    queue.forEach(watcher=>watcher.Update())
    queue=[]
}