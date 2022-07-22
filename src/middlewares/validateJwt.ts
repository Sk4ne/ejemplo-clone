import dotenv from 'dotenv';
dotenv.config();
import { Request, Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User from '../models/user';


export const validateJwt = async(req:Request, res:Response, next: NextFunction) => {
    /** Read token in the headers */
    const token = req.header('x-token');
    if(!token){
      /** 401 no authorization */
     return res.status(401).json({
         msg: 'No token in the request'
     })
    }

   try {
    /** Verify if token is valid */
    let privateKey:any = process.env.SECRET_OR_PRIVATE_KEY;
    const dataReturn:any = jwt.verify(token, privateKey);

    /** id dataReturn */
    const { id } = dataReturn;

    /** Read the user that corresponds to the id */
    const user:any = await User.findById(id);
    if(!user){
      return res.status(401).json({
        msg: 'There are not users in DB / token no valid'  
      })  
    }
    /** Verify is id have state true */
    if(!user.state){
      return res.status(401).json({
        msg: 'Token no valid - user with state:false'  
      })  
    }
    /* req.user = user; */
    next();

   } catch (err) {
      res.status(401).json({
        msg: 'Token no valid'  
      }) 
   } 
}
