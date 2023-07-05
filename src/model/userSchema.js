const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tasks:[
        {
            taskname:{
                type:String,
                required:true,
            },
            taskdes:{
                type:String,
                required:true,
            },
            taskcompleteornot:{
             type:Number,
             default:0,
             required:true
            },
            taskdate:{
                type:Date,
                 default:Date.now ,
                 required:true,
            }
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ]
})

// hashing the password before saving it
UserSchema.pre('save',async function(next){
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password ,12);
    this.confirmpassword = await bcrypt.hash(this.confirmpassword,12);
  }
})

UserSchema.methods.autogeneratetoken = async function(){
    try{
        let token = jwt.sign({_id: this._id} , "heythisisthetasktmanagementsystemusingmern");
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
        }
        catch(err){
            console.log(err);
        }
}

UserSchema.methods.addTaks = async function(taskname,taskdes){
  try{
    this.tasks = await this.tasks.concat({taskname,taskdes});
    await this.save();
    return this.tasks;
  }
  catch(err){
    console.log(err);
  }
}

UserSchema.methods.changestatus = async function(){
    try{
        if(this.taskcompleteornot===0){
            this.taskcompleteornot =1;
        }
        else{ 
            this.taskcompleteornot =0;
        }
        await this.save();
        return this.taskcompleteornot;
    }
    catch(err){
        console.log(err);
    }
}

const User = mongoose.model('user',UserSchema);

module.exports = User;