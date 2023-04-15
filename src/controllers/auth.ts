import User from '../models/user'
import bcrypt from 'bcryptjs'
import { generateJWT } from '../helpers/generateJwt'
import { Request, Response, NextFunction} from 'express'

export const login = async (req: Request, res: Response,next:NextFunction) => {
   try {
      /** Exist email */
      const { email,password } = req.body;
      const user:any  = await User.findOne({email}); 
      if(!user) {
        return res.status(400).json({
          msg:'El correo o la contrasena son incorrectos!'
        });
      }
      /** Verify state user */
      if(!user.state){
        return res.status(400).json({
          msg:' User desactivate'
        });
      }
     /** Verify that passwords match  */
     const validPass:boolean = bcrypt.compareSync(password, user.password);
     if(!validPass){
        return res.status(400).json({
          msg:'El correo o la contrasena son incorrectos!'
        })
     }
    /** Generar JWT */
    // const token = await generateJWT(user.id);
    const token = await generateJWT(user.id,user.name,user.email);
    res.json({
      user,
      token 
    })
   } catch (err) {
     console.log(err)
     res.status(500).json({
        msg: 'Speak with the admin'  
     })  
   } 
}
