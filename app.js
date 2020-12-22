const express=require('express');
const app=express();
const port=3000;
app.listen(port,function(error){
    if(error){
        console.log("error")

    }
    else{
        console.log("Port is running 3000")
    }
})
app.get("/",function(req,res){
    res.send('ravi is a good man');
})