// import { UserData, UserInfo} from '../../types'
import { Request,Response,NextFunction } from "express";


export const userAdmin = (req: Request,res:Response,next:NextFunction) =>{
  // const { role, name }:User = req.user;
  const roleUser:any = req.user;
  const nameUser:any = req.user;

  if(roleUser?.role!== 'ADMIN_ROLE'){
      return res.status(401).json({
        msg: `${nameUser?.name} You do not have administrator permissions`
      })
  }
  next();
}
