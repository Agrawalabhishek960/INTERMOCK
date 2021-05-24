# INTERMOCK
THis is our project which will help us learn how to actually use the git as a version control and work in a team as well.
mongoose.connect('mongodb+srv://INTERMOCK:INTERMOCK@cluster0.o8owo.mongodb.net/USERS?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=> {
    console.log("connected to DB");
}).catch(err => {
    console.log("Error",err.message);
});


My data base is here:
mongoose.connect('mongodb+srv://irretus:irretus@irretusagrobackend.nfbaw.mongodb.net/users?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=> {
    console.log("connected to DB");
}).catch(err => {
    console.log("Error",err.message);
});


//To create a new user
let user= new User({

    email: "myname@gmail.com",

    password: "Mypassword"

  });

user.save(function(error){
    if(error){
        console.log(error)
    }
    else{
        console.log("inserted a new user in the database "+ user)
    }
});


