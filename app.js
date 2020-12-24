const express=require('express');
const app=express();
var mongoose= require('mongoose');
var User=require("./models/user");
const port=process.env.PORT || 3000;
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://INTERMOCK:INTERMOCK@cluster0.o8owo.mongodb.net/USERS?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=> {
    console.log("connected to DB");
}).catch(err => {
    console.log("Error",err.message);
});
app.set("view engine","ejs");
app.use(express.static("public"));
app.listen(port,function(error){
    if(error){
        console.log("error")

    }
    else{
        console.log("Port is running 3000")
    }
})
app.get("/",function(req,res){
    res.render("home");
})
app.get("/home",function(req,res){
    res.render("home");
})
// let user= new User({

//     email: "agra",

//     password: "kk"

//   });

// user.save(function(error){
//     if(error){
//         console.log(error)
//     }
//     else{
//         console.log("inserted a new user in the database "+ user)
//     }
// });
