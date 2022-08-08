import { NextFunction, Request, Response } from "express";

 export const isLoggedIn = async(req:Request,res:Response,next:NextFunction) => {
  console.log('REQUEST IS LOGGEDIN',req.user);
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
