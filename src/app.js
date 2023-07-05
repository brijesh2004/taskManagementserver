const express = require("express");
const app = express();
app.use(express.json());

require("../src/db/conn");
app.use(require("../src/router/auth"));

app.get("/",(req,res)=>{
    res.send("hello World");
})


app.listen(7000,()=>{
    console.log("app is listening on the port number 7000");
})