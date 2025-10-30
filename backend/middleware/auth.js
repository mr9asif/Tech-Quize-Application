import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const jwt_Secret = 'your jwt token';

export default async function authMiddleware(req, res, next){
      const authHeader = req.headers.authoriation;
      if(!authHeader || !authHeader.startwith('Bearer ')){
        return res.status(401).json({
            success:false,
            message:'not authorize'
        })
      }
      const token = authHeader.split(' ')[1];

    //   varify
       try {
         const payload=jwt.verify(token, jwt_Secret);
         const user =await User.findById(payload.id).select('-password');
         if(!user){
            return res.status(401).json({
                success:false, message:"user not found"
            })
         };
         req.user = user;
         next();
       } catch (error) {
        console.log('jwt verify err' , error);
        return res.status(500).json({
            success:false, message:'token invalid or epired'
        })
       }
  
} 