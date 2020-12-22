const http=require("http");
const port=3000
const fs=require('fs')
const server=http.createServer((req,res)=>{
    fs.readFile("home.html",function(err,data){
        if(err){
            res.writeHead(404)
            console.log("err")
        }
        else{
            res.write(data)
        }
        res.end()
    })
   
})
server.listen(port,function(error){
    if(error){
        console.log("Bd")
    }
    else{
        console.log("Server is running well")
    }
})
