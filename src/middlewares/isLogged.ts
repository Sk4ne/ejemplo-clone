import { NextFunction, Request, Response } from "express";

 export const isLoggedIn = async(req:Request,res:Response,next:NextFunction) => {
  if (req.isAuthenticated()){
    next();
  }else{
    res.status(401).json({
      msg: 'Not Logged In'
    });
  }
}
