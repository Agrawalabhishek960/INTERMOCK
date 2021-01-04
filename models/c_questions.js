var mongoose=require('mongoose');
var c_queSchema=new mongoose.Schema({
    question:{type:String},
    answer:{type:String}
});
module.exports=mongoose.model("C_ques",c_queSchema)