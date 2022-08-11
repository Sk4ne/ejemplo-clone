import dotenv from 'dotenv'
dotenv.config();
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateJWT = (id:string | Types.ObjectId= '') => {
   return new Promise((resolve,reject)=>{
       const payload = { id };
       jwt.sign(payload,process.env.SECRET_OR_PRIVATE_KEY as string,{
         expiresIn: '10d'
       },(err,token)=>{
          if(err){
            console.log(err);
            reject('No se pudo generar el token');  
          }else{
            resolve(token);  
          } 
       })
   })
}

