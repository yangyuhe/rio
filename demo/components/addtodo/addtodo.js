Rio.component("addtodo",{
    templateUrl:"./components/addtodo/addtodo.html",
    data:{
        title:"",
        des:"",
        settime:[],
        time:"",
        type:2
    },
    events:["add"],
    methods:{
        confirm:function(){
            this.$emit("add",{title:this.title,des:this.des,settime:this.settime.length>0?true:false,time:this.time,type:this.type})
        }
    }

})