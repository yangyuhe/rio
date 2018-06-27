export const DIR_MODEL = "model"
export const DIR_EVENT_CLICK = "click"
export const PRE="r-"

/**花括号数据绑定表达式 */
export const REG_SINGLE = /^\{\{([^\{\}]*)\}\}$/
export const REG_MULTI = /\{\{(.*?)\}\}/
/**事件监听响应函数 */
export const REG_EVENT=/^(\w+)\((.*)\)$/
/**字符串 */
export const REG_STR=/^(['"])(.*?)\1$/
export const REG_MID_STR=/(['"])(.*?)\1/

/**输入属性 */
export const REG_IN=/^\[(\w+)\]$/
/**输出事件 */
export const REG_OUT=/^\((\w+)\)$/
/**正常属性 */
export const REG_ATTR=/^[A-z_]\w*$/


/**测试输出项 */
export const REG_TEST_OUTPUT=/^((click))$/

export enum VNodeStatus{
    /**依然处于vnode树中 */
    ACTIVE,
    /**不在vnode树中但是有可能重新加回来 */
    INACTIVE,
    /**抛弃 */
    DEPRECATED
}

export enum DomType{
    /*没有变化的*/
    CONSTANT,
    /**新增的 */
    NEW,
    /**删除的 */
    DELETE
}