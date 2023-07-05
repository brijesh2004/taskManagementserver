const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/TaskManegmentSystem",{
    usenewUrlParser:true
}).then(()=>{
    console.log("connection successfull");
}).catch((err)=>{
    console.log("no connection");
})