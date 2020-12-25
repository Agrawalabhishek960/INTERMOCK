var mongoose=require('mongoose');
var userSchema=new mongoose.Schema({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    phone:{type:Number,required:true},
    address:{type:String},
    email:{
        type:String,unique:true,required:true,match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password:{
        type:String,required:true
    }
});

module.exports=mongoose.model("User",userSchema)