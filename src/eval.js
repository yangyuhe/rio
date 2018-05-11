var EvalSingle=function(context,exp){
    var res
    with(context){
        res=eval(exp)
    }
    return res
}
function EvalMulti(context,str){
    var res=""
    var values=str.match(/\{\{(.*?)\}\}/g)
    var start=0
    var end=0
    for(var i=0;i<values.length;i++){
        end=str.indexOf(values[i])
        with(context){
            res+=str.substring(start,end)+eval(values[i].substring(2,values[i].length-2))
        }
        start=end+values[i].length
    }
    return res
}