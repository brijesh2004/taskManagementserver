const express = require("express");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const router = express.Router();
const User = require("../model/userSchema");
router.use(express.json());
router.use(cookieParser());
const authenticate = require("../authenticate/authenticate");
router.use(
    cors({
      credentials:true,
    //   origin:[`${process.env.PATH}`],
    origin:["https://task-management-system-6ar7.onrender.com"],
      methods:['GET','POST','DELETE'],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  )


router.get("/",(req,res)=>{
    res.send("router Hello World");
})

router.post("/register",async (req,res)=>{
    try{
        const {name,email,password,confirmpassword} = req.body;
        // console.log(name , email , password , cpassword);
        if(!name || !email ||!password ||!confirmpassword){
            res.status(422).json({message:"Please fill all the given field"});
        }
        if(password===confirmpassword){
          const userExist = await User.findOne({email:email});
          if(userExist){
            res.status(422).json({message:"user already exist"});
          }
          else{
            const newUser =new User({ name, email, password, confirmpassword });
            await newUser.save();
            res.status(201).json({message:"User Register Successfully"});
          }
        }
        else{
            res.status(422).json({err:"password are not matching"});
        }
    }
    catch(err){
        res.status(401).json(err);
    }
  
})


router.post('/login', async (req, res) => {
  //res.header('Access-Control-Allow-Origin', `http://localhost:3000`);
  try {
      const { email, password } = req.body;
      // console.log(req.body);
      if (!email || !password) {
          return res.status(400).json({ error: "Please filled the data" });
      }

      const userLogin = await User.findOne({ email: email });
      // console.log(userLogin);
      if (userLogin) { 
          const isMatch = await bcrypt.compare(password, userLogin.password);
          // console.log(password);
          // console.log(userLogin.password);
          // console.log(isMatch);
          const token = await userLogin.autogeneratetoken();
          // console.log(token);

          //   cookie store  
          res.cookie("jwttoken", token, {
              expires: new Date(Date.now() + 25892000000),
              httpOnly: true,
              sameSite:'none', 
              secure:true
          });
          if (!isMatch) {
              res.status(400).json({ error: "invalid user credentia" });
          }
          else {
              res.json({ message: "user signin Successfully" });
          }
      }
      else {
          res.status(400).json({ error: "invalid user credentials" });
      }
  } catch (err) {
      
      console.log(err);
      res.send(err);
  }
})

router.post("/addtask",authenticate ,async (req,res)=>{
  try{
    const {taskname,taskdes} = req.body;
    if(!taskname || !taskdes){
      res.status(400).json({error:"Please fill all the details"});
    }
    else{
      const finduser = await User.findOne({ _id: req.userID });
      if(finduser){
        const usertask = await finduser.addTaks(taskname,taskdes);
        await finduser.save();
        res.status(201).json({message:"Task Added Successfully"});
      }
    }
  }catch(err){
    console.log(err);
    res.status(400).send(err);
  }
   
   
})

router.get("/findtheuserdata",authenticate,async(req,res)=>{
  try{
      const finduser = await User.findOne({ _id: req.userID });
      // console.log(finduser);
      res.send(finduser);
  }
  catch(err){
    res.status(401).json({err:"unautherised user"});
  }
})

router.get("/findtheusertask",authenticate,async(req,res)=>{
  try{
      const finduser = await User.findOne({ _id: req.userID });
      // console.log(finduser);
      res.send(finduser.tasks);
  }
  catch(err){
    res.status(401).json({err:"unautherised user"});
  }
})



router.post("/api/model/:id",authenticate , async (req,res)=>{
   try{
    // console.log(req.params.id);
    const id = req.params.id;
    const findUser = await User.findOne({_id:req.userID});
    // const usertask = findUser.tasks;
    const findTaskid = findUser.tasks.id(id);
      // console.log(findTaskid);
    if(findTaskid){
     if(findTaskid.taskcompleteornot===0){
      findTaskid.taskcompleteornot=1;
     }
     else{
      findTaskid.taskcompleteornot=0;
     }
    } 
    await findUser.save(); // Save the changes to the user object

    res.status(201).send(findTaskid);

   }
   catch(err){
    console.log(err);
    res.send(err);
   }
})


router.post("/api/edit/:id",authenticate , async (req,res)=>{
  try{
   const id = req.params.id;
   const findUser = await User.findOne({_id:req.userID});
   // const usertask = findUser.tasks;
   const findTaskid = findUser.tasks.id(id);
    //  console.log(findTaskid);


   res.status(201).send(findTaskid);

  }
  catch(err){
   console.log(err);
   res.send(err);
  }
})

router.post("/api/change/:id", authenticate ,async (req,res)=>{
  try{
    const id = req.params.id;
    // console.log(id);
    const {username,userdes} =req.body;
    // console.log(username,userdes);
    const findUser = await User.findOne({_id:req.userID});
   
    // const usertask = findUser.tasks;
    const findTaskid = findUser.tasks.id(id);
    // console.log("after the authenticate");
      // console.log(findTaskid);
      if(findTaskid){
        findTaskid.taskname = username;
        findTaskid.taskdes = userdes;
      }
      await findUser.save();
      res.status(201).send(findUser);
  }
  catch(err){
    res.status(401).send(err);
  }
})


router.delete("/api/delete/:id",authenticate , async (req,res)=>{
  try{
    const id = req.params.id;
    // console.log(id);
    const findUser = await User.findOne({_id:req.userID});
    findUser.tasks.pull(id);

    await findUser.save(); // Save the changes
      res.status(200).send("Task deleted successfully.");
  }
  catch(err){
    res.status(400).send(err);
  }
})
module.exports = router;