const express=require('express');
const app=express();
var mongoose= require('mongoose');
var User=require("./models/user");
const port=process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
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
app.get("/register",function(req,res){
    res.render("register")
})
app.get("/login",function(req,res){
    res.render("login")
})
app.post("/register",function(req,res){
    var newUser=new User({
        firstname:req.body.fname,
        lastname:req.body.lname,
        email: req.body.email,
        password: req.body.password,
        address:req.body.address,
        phone:req.body.phone
    })
    newUser.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            console.log(newUser+"saved a new user")
        }
    })
    res.redirect("/login")
})


