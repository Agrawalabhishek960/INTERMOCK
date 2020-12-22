const express=require('express');
const app=express();
const port=3000;
<<<<<<< HEAD
=======

app.get("/",function(req,res){
    res.send('<h1>Ayu.<br>Come back to my life')

})
>>>>>>> ae18cc06d986966574e30ad572bf1ca1b41b0c7c
app.listen(port,function(error){
    if(error){
        console.log("error")

    }
    else{
<<<<<<< HEAD
        console.log("Port is running 3000")
    }
})
app.get("/",function(req,res){
    res.send('ravi is a good man');
})
=======
        console.log("Port is up and running")
    }
})
>>>>>>> ae18cc06d986966574e30ad572bf1ca1b41b0c7c
