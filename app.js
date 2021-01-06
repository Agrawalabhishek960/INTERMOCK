const express=require('express');
const app=express();
var LocalStrategy= require('passport-local')
var methodOverride=require('method-override');
var expressSanitizer= require('express-sanitizer');
var flash=require("connect-flash")
var passport= require('passport')
var User=require("./models/user");
var C_ques=require("./models/c_questions");
var multer=require("multer")
var upload=multer({dest:'uploads/'})
var crypto =require("crypto")
var async=require("async")
var nodemailer = require('nodemailer');
const port=process.env.PORT || 3000;
const {isLoggedIn}=require("./middleware/isLoggedIn")
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
require('dotenv').config();
require('./database/mongoose.js')
app.set("view engine","ejs");
app.use(expressSanitizer());
app.use(methodOverride("_method"));
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
app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error')
  next()
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
app.post("/register",upload.single('resume'),async function(req, res){
    var newUser = new User({
        name: req.body.name,
        username:req.body.username,
        email: req.body.email,
        phone:req.body.phone,
        address:req.body.address,
        resume:req.body.resume
    });
    console.log(req.body,req.file)
    console.log(newUser)
    await User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }passport.authenticate("local")(req, res, function(){
          req.flash("success","You have successfully created your account")  
          res.redirect("/home"); 
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'entermock@gmail.com',
              pass: process.env.GMAIL_PWD
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
  //mail number 2
  var transporter2 = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'entermock@gmail.com',
        pass: process.env.GMAIL_PWD
      }
    });
                      
  var mailOptions2 = {
    from: 'entermocks@gmail.com',
    to: 'entermocks@gmail.com',
    subject: 'A new user has registered.',
    text: "Hello sir, a new user has registered just now. Here are the details"+`
    `+"name-> "+req.body.name+`
    `+"username-> "+req.body.username+`
    `+"email-> "+req.body.email+`
    `+"phone-> "+req.body.phone+`
    `+"address-> "+req.body.address
  };
  
  
  transporter2.sendMail(mailOptions2, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
         });
        });

});
app.post("/login", passport.authenticate("local",
{
  failureRedirect:"/login",failureFlash:'Invalid Username or password'
}),(req,res)=>{
    req.flash("success","Logged in successfully")
    res.redirect("/home");
})
app.get("/logout", function(req, res){
    req.logout();
    req.flash("success","Logged out successfully")
    res.redirect("/home");
 });
 app.get("/prepare",isLoggedIn,function(req,res){
     res.render("prepare")
 })
 app.get("/home/:id",function(req,res){
	User.findById(req.params.id, function(err,foundUser){
		if(err)
			{
				console.log(err);
			}
		else{
			res.render("show",{user:foundUser});
		}
	});
});

app.get("/forgot",function(req,res){
  res.render("forgot")
})

app.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: 'entermock@gmail.com',
          pass: process.env.GMAIL_PWD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'entermock@gmail.com',
        subject: 'EnterMock Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

  app.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        console.log(err)
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });

  app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'gmail', 
          auth: {
            user: 'entermock@gmail.com',
            pass: process.env.GMAIL_PWD
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'entermock@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });
  app.get("/home/:id/settings",function(req,res){
    User.findById(req.params.id,function(err,foundUser){
      if(err)
        {
          console.log(err);
        }
      else{
        res.render("settings",{user:foundUser});
      }
    });
  });
  app.put("/home/:id",function(req,res){
    User.findByIdAndUpdate(req.params.id,req.body.user,function(err,updateUser){
      if(err){
        console.log(err)
      }
      else{
        res.redirect("/home/"+req.params.id);
      }
    });
  });
  app.get("/payScheme",function(req,res){
    res.render("payScheme")
  })
  app.post("/callback",function(req,res){
    res.send("Payment successful")
  })
  const Paytm = require('paytm-pg-node-sdk');

 const checksum_lib = require('./checksum/checksum');
  app.get("/payment",isLoggedIn,function(req,res){
    let params={}
    params['MID']="vccQcf97486308841965"
    params['WEBSITE']="WEBSTAGING"
    params['CHANNEL_ID']="WEB"
    params['INDUSTRY_TYPE_ID']="Retail"
    params['ORDER_ID']="ORD"+ new Date().getTime();
    params['CUST_ID']="ENTMK00" +new Date().getTime();
    params['TXN_AMOUNT']="5"
    params['CALLBACK_URL']='http://localhost:'+port+'/callback'
    params['EMAIL']='rganga757@gmail.com'
    params['MOBILE_NO']="9140739195"
    checksum_lib.genchecksum(params,'BiDwlnx!EB3fyiw3',function(err,checksum){
      let txn_url="https://securegw-stage.paytm.in/order/process"
      let form_fields=""
      for(x in params){
        form_fields+="<input type='hidden' name='"+x+"' value='"+params[x]+"'/>" 
      }
      form_fields+="<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"'/>"
      var html='<html><body><center><h1>Please wait! Do not refresh the page </h1></center><form method="post" action="'+txn_url+'"name="f1" >'+form_fields+'</form><script type="text/javascript">document.f1.submit()</script></body>'
      res.send(html)
    })
  })
  app.get("/c_material/update",function(req,res){
    res.render("materials/c_material_update")
  })
  app.get("/c_material",function(req,res){
    C_ques.find({},function(err,c_ques){
      if(err){
        console.log(err);
      }
      else{
        res.render("materials/c_material",{c_ques:c_ques});
      }
    });
  });
  app.post("/c_material",function(req,res){
    req.body.c_ques.body= req.sanitize(req.body.c_ques.body)
    C_ques.create(req.body.c_ques,function(err,newques){
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/c_material");
      }
    });
  });
  app.get("/c_material/:id/edit",function(req,res){
    C_ques.findById(req.params.id,function(err,foundques){
      if(err)
        {
          console.log(err);
        }
      else{
        res.render("materials/c_edit",{c_que:foundques});
      }
    });
  });
  app.put("/c_material/:id",function(req,res){
    req.body.c_que.body= req.sanitize(req.body.c_que.body)
    C_ques.findByIdAndUpdate(req.params.id,req.body.c_que,function(err,updateque){
      if(err){
        console.log(err)
      }
      else{
        res.redirect("/c_material");
      }
    });
  });
  app.delete("/c_material/:id",function(req,res){
    C_ques.findByIdAndRemove(req.params.id,function(err){
      if(err){
        res.redirect("/c_material");
      }
      else{
        res.redirect("/c_material");
      }
    });
  });