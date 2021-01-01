var mongoose=require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
var incrementSchema=new mongoose.Schema({
    orderID:Number,
    customerID:Number
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("Increment",userSchema)