import { NextFunction, Request, Response } from "express";

 export const isLoggedIn = async(req:Request,res:Response,next:NextFunction) => {
   // CODE ORIGINAL
  /* if (req.isAuthenticated()){
    // next();
    // console.log(req.isAuthenticated())
    
    return next()
  }else{
    res.status(401).json({
      msg: 'Not Logged In'
    });
  } */

  if (req.user) {
    next();
  } else {
    res.status(401).send('Not Logged In')
  }
}
