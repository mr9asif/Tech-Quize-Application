import bycript from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import validator from 'validator';
import User from "../models/userModel.js";

const token_expire_in = '24h';
const jwt_Secret = 'your jwt token';

// register
export async function register(req, res){

 try {
     const {name, email, password} = req.body;
     console.log(req.body.name)
     if(!name || !email || !password){
        return res.status(400).json({
            success:false,
            message:"all fields are required!"
        })   
     }
     if(!validator.isEmail(email)){
        return res.status(400).json({
            success:false,
            message:"Invalid email!"
        })
     }

     const exist = await User.findOne({email}).lean();
     if(exist){
        return res.status(400).json({
            success:false,
            message:"user already exists!"
        })
     }
     const newId = new mongoose.Types.ObjectId();
     const hasPassword = await bycript.hash(password, 10);
     const user = new User({
        _id : newId,
        name, email, password:hasPassword

     });
     await user.save();
     if(!jwt_Secret) throw new error("jwt_secret token not found!")
      const token = await jwt.sign({id:newId.toString()}, jwt_Secret, {expiresIn:token_expire_in});

     return res.status(201).json({
        success:true,
        message:'account created successfully', token, 
        user:{id:user._id.toString(), name:user.name, email:user.emal}
     })

 } catch (error) {
     console.log("register err:", error);
     return res.status(500).json({
        success:false,
        message:"register server err",
     })
 }
}

// login..
export async function login(req, res){
 try {
       const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"all fields are required!"
        })
    }
    const user = await User.findOne({email});
    const isMatch = await bycript.compare(password, user.password);
    if(!user || !isMatch){
        return res.status(401).json({
            success:false,
            message:"invalid email or password!"
        })
    }

     const token = await jwt.sign({id:user._id.toString()}, jwt_Secret, {expiresIn:token_expire_in});

     return res.status(201).json({
        success:true,
        message:'login  successfully', token, 
        user:{id:user._id.toString(), name:user.name, email:user.emal}
     })

 }catch (error) {
     console.log("login err:", error);
     return res.status(500).json({
        success:false,
        message:"login server err",
     })
 }

}