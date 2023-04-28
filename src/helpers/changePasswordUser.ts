import { Request,Response,NextFunction, request } from 'express'
import { User } from '../models';
import bcrypt from 'bcryptjs'
import { UserData } from '../interfaces/userInterface';

export const changePasswordUser = async(req:Request,res:Response,next:NextFunction) => {
  try {
    const { id } = req.params;
    const {oldPassword, newPassword } = req.body;
    const user:UserData | null = await User.findById(id)
    if(!user){
      res.status(404).json({msg: 'El usuario no existe'})
    }
    const isMatchPassword:any = await bcrypt.compare(oldPassword, user!.password!)
    if(!isMatchPassword){
      res.status(404).json({msg: 'Las contrasenas no coinciden'});
    }else{
      // ACTUALIZAR LA CONTRASENA
      const hash = await bcrypt.hash(newPassword,10);
      user!.password = hash;
      await user!.save();
      res.status(200).json({
        msg: 'Contrasena Actualizada!',
      })

    }
  } catch (error) {
    res.status(500).json({
      message: ` An error ocurred ${error}`  
    })  
    // next(error)
  }
}