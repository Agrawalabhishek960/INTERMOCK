var mongoose= require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=> {
    console.log("connected to DB");
}).catch(err => {
    console.log("Error",err.message);
});