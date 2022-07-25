import { Request,Response,NextFunction } from "express";


export const userAdmin = (req: Request,res:Response,next:NextFunction) =>{

  interface User {
    role:string;
    name:string; 
  }
  
  const { role, name }:User = req.user;
  if(role!== 'ADMIN_ROLE'){
      return res.status(401).json({
        msg: `${name} You do not have administrator permissions`
      })
  }
  next();
}
