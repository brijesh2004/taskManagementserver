const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticate = async function(req,res,next){
    try{
    const token = req.cookies.jwttoken;
    const verifytoken = jwt.verify(token,"heythisisthetasktmanagementsystemusingmern");
    const rootUser = await User.findOne({_id : verifytoken._id,"tokens.token":token});
    if(!rootUser){
        throw new Error("User Not Found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
    }
    catch(err){
        // console.log(err);
        res.status(401).send("Unauthorized : No token Provided");
    }
}

module.exports=authenticate;