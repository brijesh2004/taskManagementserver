const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://brijesh122004:task12345@cluster0.8anse6u.mongodb.net/?retryWrites=true&w=majority",{
    usenewUrlParser:true
}).then(()=>{
    console.log("connection successfull");
}).catch((err)=>{
    console.log("no connection");
})