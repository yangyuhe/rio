var EvalExp=function(context,exp){
    var res
    try {
        with(context){
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
