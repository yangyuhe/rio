import { VNode } from "../vnode/vnode"
export function DirModel(exp: string, vnode: VNode) {
    let inputtype=vnode.Vdom.GetAttr("type")
    let input=vnode.Vdom.NodeName.toLowerCase()
    if(input=="input" && inputtype=="checkbox"){
        vnode.mvvm.$watchExpOrFunc(vnode,exp, (newvalue) => {
            setValue(vnode, newvalue)
        },true);
    }else{
        vnode.mvvm.$watchExpOrFunc(vnode,exp, (newvalue) => {
            setValue(vnode, newvalue)
        });
    }
    vnode.Dom.addEventListener("input", (event: any) => {
        //select控件
        if (vnode.NodeName.toLowerCase() == "select") {
            vnode.mvvm.SetValue(exp, event.target.value)
            return
        }
        //text radio checkbox控件
        let inputType = (vnode.Dom as HTMLElement).getAttribute("type")
        if (inputType == null || inputType == "")
            inputType = "text"
        switch (inputType) {
            case "text":
            case "radio":
                vnode.mvvm.SetValue(exp, event.target.value)
                break
            case "checkbox":
                let cur = vnode.mvvm.GetExpValue(exp)
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
    //select控件
    if (vnode.NodeName.toLowerCase() == "select") {
        (vnode.Dom as HTMLInputElement).value = newvalue
        return
    }
    //text radio checkbox控件
    let inputType = (vnode.Dom as HTMLElement).getAttribute("type")
    if (inputType == null || inputType == "")
        inputType = "text"
    switch (inputType) {
        case "text":
            (vnode.Dom as HTMLInputElement).value = newvalue
            break
        case "radio":
            if ((vnode.Dom as HTMLInputElement).value == newvalue) {
                (vnode.Dom as HTMLInputElement).checked = true
            } else
                (vnode.Dom as HTMLInputElement).checked = false;
            break
        case "checkbox":
            if (toString.call(newvalue) == "[object Array]") {
                if (newvalue.indexOf((vnode.Dom as HTMLInputElement).value) == -1) {
                    (vnode.Dom as HTMLInputElement).checked = false
                } else
                    (vnode.Dom as HTMLInputElement).checked = true;
            }

            break
    }
}