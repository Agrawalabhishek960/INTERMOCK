var mongoose=require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema=new mongoose.Schema({
    name:{type:String},
    email:{
        type:String,unique:true,required:true,match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    phone:{type:Number},
    address:{type:String},
    resetPasswordToken: {type:String},
	resetPasswordExpires: {type:Date},
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema)