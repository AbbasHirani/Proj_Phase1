const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");


app.use(session({secret:"secretstring" , resave:false , saveUninitialized:true}));
app.use(flash());

app.get("/",(req,res)=>{
    res.send("working");
}) 

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count = 1;
    }

    res.send(`you sent request ${req.session.count} times`);
})

app.listen(3000, ()=>{
    console.log("server is lisitng to port 3000");
})