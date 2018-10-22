/**自定义dom对象，区别于js原生dom对象 */
export declare class CustDom {
    /**标签名 当type='element'时有意义*/
    Name: string;
    /**文本值 当type='text'时有意义 */
    Text: string;
    /**属性 */
    Attrs: {
        Name: string;
        Value: string;
    }[];
    /**标签类型 目前支持元素，文本和备注三种类型 */
    Type: "element" | "text" | "comment";
    /**孩子dom */
    Children: CustDom[];
    /**父级dom 如果有的话 */
    parent: CustDom;
    constructor(name: string, text: string, type: "element" | "text" | "comment", attr: {
        Name: string;
        Value: string;
    }[], children: CustDom[], parent: CustDom);
    GetAttr(name: string): string;
    AddClass(classname: string): void;
}
/**解析和生成一个自定义节点树 */
export declare function Parse(html: string): CustDom[];
