import dotenv from 'dotenv';
dotenv.config();
import { Request, Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User from '../models/user';


export const validateJwt = async(req:Request, res:Response, next: NextFunction) => {
    /**
      * Leer el token en los headers
    */ 
    const token = req.header('x-token');
    if(!token){
      /**
       * 401 no authorization 
      */  
     return res.status(401).json({
         msg: 'No hay token en la petición'
     })
    }

   try {
    /**
     * Verificar si el token es válido
    */
    interface Person {
      id: string  
    }

    /** return {id, iat, exp} */
    let privateKey:any = process.env.SECRET_OR_PRIVATE_KEY;
    const dataReturn:any = jwt.verify(token, privateKey);

    /** id dataReturn */
    const { id } = dataReturn;

    /**
     * Leer el usuario que corresponde al id;
    */
    const user = await User.findById(id);
    if(!user){
      return res.status(401).json({
        msg: 'Token no válido - usuario no existe en la DB'  
      })  
    }
    /**
     * Verificar s el uid tiene state ture
    */
    if(!user.state){
      return res.status(401).json({
        msg: 'Token no válido - usuario con state:false'  
      })  
    }
    // req.user = user;
    next();

   } catch (err) {
      res.status(401).json({
        msg: 'Token no válido'  
      }) 
   } 
}
