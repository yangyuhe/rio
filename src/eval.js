var EvalExp=function(context,exp){
    var res
    with(context){
        res=eval(exp)
    }
    return res
}
exports.EvalExp=EvalExp
