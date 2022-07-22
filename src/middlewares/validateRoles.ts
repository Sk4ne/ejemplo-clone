/* import { Request, Response, NextFunction } from 'express'

export const esAdminRole = (req:Request,res:Response,next:NextFunction) => {
  if(!req.user){
    return res.status(500).json({
       msg:'Se quiere verificar el role sin validar el token primero' 
    }); 
  }
  const { role,name } = req.user;
  if(role!== 'ADMIN'){
    return res.status(401).json({
      msg: `${ name } is not an admin`   
    });  
  }
  next();
}
 */