import { VinallaNode } from './../vnode/vinalla-node';
import { VNode } from "../vnode/vnode"
export function DirModel(exp: string, vnode: VinallaNode,isconst:boolean) {
    let inputtype=vnode.Vdom.GetAttr("type")
    let input=vnode.Vdom.NodeName.toLowerCase()

    let newvalue=vnode.mvvm.$GetExpOrFunValue(exp);
    setValue(vnode, newvalue)
    if(input=="input" && inputtype=="checkbox"){
        vnode.mvvm.$CreateWatcher(vnode,exp, (newvalue) => {
            setValue(vnode, newvalue)
        },true);
    }else{
        vnode.mvvm.$CreateWatcher(vnode,exp, (newvalue) => {
            setValue(vnode, newvalue)
        });
    }
    vnode.DomSet[0].dom.addEventListener("input", (event: any) => {
        //select控件
        if (vnode.GetNodeName() == "select") {
            vnode.mvvm.$SetValue(exp, event.target.value)
            return
        }
        //text radio checkbox控件
        let inputType = (vnode.DomSet[0].dom as HTMLElement).getAttribute("type")
        if (inputType == null || inputType == "")
            inputType = "text"
        switch (inputType) {
            case "text":
            case "radio":
                vnode.mvvm.$SetValue(exp, event.target.value)
                break
            case "checkbox":
                let cur = vnode.mvvm.$GetExpOrFunValue(exp)
                if (toString.call(cur) == "[object Array]") {
                    let oldarray = cur as Array<any>;
                    let index = oldarray.indexOf(event.target.value)
                    if (index == -1) {
                        oldarray.push(event.target.value)
                    } else {
                        oldarray.splice(index, 1)
                    }
                }
                break
        }
    })
}

function setValue(vnode: VNode, newvalue: any) {
    let dom=vnode.DomSet[0].dom;
    //select控件
    if (vnode.GetNodeName()== "select") {
        (dom as HTMLSelectElement).value = newvalue;
        return
    }
    //text radio checkbox控件
    let inputType = (dom as HTMLElement).getAttribute("type")
    if (inputType == null || inputType == "")
        inputType = "text"
    switch (inputType) {
        case "text":
            (dom as HTMLInputElement).value = newvalue
            break
        case "radio":
            if ((dom as HTMLInputElement).value == newvalue) {
                (dom as HTMLInputElement).checked = true
            } else
                (dom as HTMLInputElement).checked = false;
            break
        case "checkbox":
            if (toString.call(newvalue) == "[object Array]") {
                if (newvalue.indexOf((dom as HTMLInputElement).value) == -1) {
                    (dom as HTMLInputElement).checked = false
                } else
                    (dom as HTMLInputElement).checked = true;
            }

            break
    }
}