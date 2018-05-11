import { VDom } from './vdom/vdom';

export interface MVVMComponentOption{
    $name?:string,
    template?:string,
    templateUrl?:string,
    data?:Object,
    methods?:{[name:string]:Function},
    props?:string[],
    events?:string[],
    style?:string,
    styleUrl?:string,
    $namespace?:string,
    $id?:string,
    $domtree?:VDom
}

export interface OnDataChange {
    (newvalue:any,oldvalue:any):void
}
/**for语句 */
export class ForExp{
    constructor(public itemExp:string,public arrayExp:string){}
}

/**返回值 */
export interface RetureValue{
    exp:string,
    data:any
}


