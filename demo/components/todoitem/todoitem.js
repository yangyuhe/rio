Rio.component("todoitem",{
    templateUrl:"./components/todoitem/todoitem.html",
    styleUrl:"./components/todoitem/todoitem.css",
    props:["todo"],
    events:["delete","modify"],
    data:{
        isedit:false,
        settime:[],
        time:"",
        type:1,
        des:''
    },
    methods:{
        delete:function(){
            this.$emit("delete")
        },
        edit:function(){
            this.isedit=true
            this.des=this.todo.des
            this.type=this.todo.type
            this.time=this.todo.time
            if(this.todo.settime){
                this.settime=["true"]
            }
        },
        confirm:function(){
            this.$emit("modify",this.todo.id,{des:this.des,type:this.type,time:this.time,settime:this.settime.length>0?true:false})
            this.isedit=false
        },
        test:function(){
            this.time="2015"
            this.time="2016"
            this.time="2015"
        }
    }
})