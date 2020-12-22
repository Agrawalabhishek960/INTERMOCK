const express=require('express');
const app=express();
const port=3000;

app.get("/",function(req,res){
    res.send('<h1>Ayu.<br>Come back to my life')

})
app.listen(port,function(error){
    if(error){
        console.log("error")

    }
    else{
        console.log("Port is up and running")
    }
})
