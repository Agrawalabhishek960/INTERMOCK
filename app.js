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
app.get("/home",function(req,res){
    res.render("home.ejs");
})
