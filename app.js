const express=require('express');
const app=express();
var LocalStrategy= require('passport-local')
var mongoose= require('mongoose');
var passport= require('passport')
var User=require("./models/user");
var nodemailer = require('nodemailer');
const port=process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
require('dotenv').config();
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=> {
    console.log("connected to DB");
}).catch(err => {
    console.log("Error",err.message);
});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(require("express-session")({
    secret: "Owner is abhishek and ravi",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });
app.listen(port,function(error){
    if(error){
        console.log("error")

    }
    else{
        console.log("Port is running 3000")
    }
});

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
app.post("/register", async function(req, res){
    var newUser = new User({
        name: req.body.name,
        username:req.body.username,
        email: req.body.email,
        phone:req.body.phone,
        address:req.body.address
    });
    await User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }passport.authenticate("local")(req, res, function(){
            res.redirect("/home"); 
         });
        });
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'entermock@gmail.com',
              pass: 'sunbeamsuncity'
            }
          });
          
          var mailOptions = {
            from: 'entermock@gmail.com',
            to: req.body.email,
            subject: 'Welcome to EnterMock ! The owl is happy with you.',
            text: "Hello "+req.body.username+`, thank you for choosing EnterMock, a complete package of all your placement needs.
We are here to help you crack your dream interview and make yourself and your loved ones proud. We are really serious about the covid pandemic and are giving our best to get you all placed.
EnterMock Family welcomes you whole-heartedly and congratulates you for this new beginning.

Thank you
EnterMock Groups of Education and Research.`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
});
app.post("/login", passport.authenticate("local",{failureRedirect:"/login"}),(req,res)=>{
    res.redirect("/home");
})
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/home");
 });
 app.get("/prepare",function(req,res){
     res.render("prepare")
 })
// app.post("/register",function(req,res){
//     var newUser=new User({
//         firstname:req.body.fname,
//         lastname:req.body.lname,
//         email: req.body.email,
//         password: req.body.password,
//         address:req.body.address,
//         phone:req.body.phone
//     })
//     newUser.save(function(err){
//         if(err){
//             console.log(err)
//         }
//         else{
//             console.log(newUser+"saved a new user")
//         }
//     })
//     res.redirect("/login")
// })
// app.post("/login",async function(req,res){
//     const {email,password}=req.body;
//     const user=await User.findOne({email});
//     if(!user){
//         res.send("No such user")
//         res.redirect("register")
//     }
//     else{
//         if(user.password!=password){
//             res.send("Wrong password")
//             res.redirect("login")
//         }
//         res.redirect("home")
//     }
// })