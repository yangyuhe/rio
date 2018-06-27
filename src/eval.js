var EvalExp=function(context,exp,attachObj){
    var res;
    var newcontext=context
    if(attachObj!=null){
        newcontext=Object.assign(context,$attachObj)
    }
    try {
        with(newcontext){
            res=eval(exp)
        }
        return res
    } catch (error) {
        console.error("eval "+exp+" failed")
        console.error(error)
    }
    return "" 
}

exports.EvalExp=EvalExp
