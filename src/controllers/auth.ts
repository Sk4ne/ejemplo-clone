import User from '../models/user'
import bcrypt from 'bcryptjs'
import { generarJWT } from '../helpers/generarJwt'
import { Request, Response, NextFunction} from 'express'

export const login = async (req: Request, res: Response,next:NextFunction) => {
   try {
      /**
       * Verificar que el email exista
      */ 
      const { email,password } = req.body;
      const user:any  = await User.findOne({email}); 
      !user ?  res.status(400).json({
        message: 'Email is not correct'
      }) : next();
     /**
       * Verificar el state del usuario
    */
    !user.state ? 
        res.status(400).json({msg:'User with state:false'})
        : next()
    /**
       * Verificar que las contraseñas hagan match
    */
    const validPass = bcrypt.compareSync(password, user.password);
    if(!validPass) {
      return res.status(400).json({msg:'Password is not correct'})
    }
    /**
     * Generar el JWT 
    */
    const token = await generarJWT(user.id);
    res.json({
      user,
      token 
    })
   } catch (err) {
     console.log(err)
     res.status(500).json({
        message: 'Speak with the admin'  
     })  
   } 
}
