export declare const DIR_MODEL = "model";
export declare const DIR_EVENT_CLICK = "click";
export declare const ANCHOR = "ref";
export declare const PRE = "r-";
/**花括号数据绑定表达式 */
export declare const REG_SINGLE: RegExp;
export declare const REG_MULTI: RegExp;
/**事件监听响应函数 */
export declare const REG_EVENT: RegExp;
/**字符串 */
export declare const REG_STR: RegExp;
export declare const REG_MID_STR: RegExp;
/**输入属性 */
export declare const REG_IN: RegExp;
/**输出事件 */
export declare const REG_OUT: RegExp;
/**正常属性 */
export declare const REG_ATTR: RegExp;
/**测试输出项 */
export declare const REG_TEST_OUTPUT: RegExp;
export declare enum VNodeStatus {
    /**依然处于vnode树中 */
    ACTIVE = 0,
    /**不在vnode树中但是有可能重新加回来 */
    INACTIVE = 1,
    /**抛弃 */
    DEPRECATED = 2,
}
export declare enum DomType {
    CONSTANT = 0,
    /**新增的 */
    NEW = 1,
    /**删除的 */
    DELETE = 2,
}
