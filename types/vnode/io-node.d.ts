import { CustDom } from '../vdom/parser';
export declare class IONode {
    private vdom;
    protected ins_pure: {
        [name: string]: any;
    };
    protected ins_exp: {
        [name: string]: string;
    };
    protected outs: {
        [name: string]: string;
    };
    constructor(vdom: CustDom);
    private addProperty(name, value);
    GetIn(prop: string): {
        value: any;
        const: boolean;
    };
    GetOut(prop: string): string;
}
