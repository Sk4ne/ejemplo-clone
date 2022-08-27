import { User } from '../models'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'
import { Request, Response,NextFunction } from 'express'
import { ObjectId } from 'mongoose'

interface UserReturnDb {
  _id: ObjectId | string;
  name: string;
  email: string;
  password: string;
  img: string;
  role: string;
  facebook: boolean;
  google: boolean;
  createAt: Date;
  state: boolean;
}

export const restorePassword = async(req:Request,res:Response,next:NextFunction) => {
  try {

    let user:UserReturnDb | null = await User.findOne({email:req.body.email});
    /* console.log('USER',user)
    console.log('UserEmail',user?.email) */

    if(!user?.email || user?.email == ''){
      return res.status(404).send("Don't exist and user with this email in the database");
    }
    
    let link = `${process.env.BASE_URL}/password-reset/${user._id}`
    let transporter = nodemailer.createTransport({
      host: process.env.BASE_URL,
      port: 587,
      secure: true, 
      service: process.env.SERVICE, 
      auth:{
        user: process.env.EMAIL_FROM,
        pass: process.env.PASS
      }
    });
    let mailOptions = {
      from: `"Survey S.A.S 👻" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: 'Survey S.A.S',
      text: "Hello world?", // plain text body
      html: //html
      `
        <p>
          Haz solicitado restablecer la contraseña de cuenta en la pagina survey S.A.S \n para hacer por favor pulsa el siguiente botón
        </p>
        <br><br><br>
        <a href="${link}" style='background-color:blue;color:white;padding:20px;font-size:18px'>Change Password</a>
      
      `
    }
    await transporter.sendMail(mailOptions,(err,info)=>{
      err ? console.log(err)
          : res.status(200).json({
            msg: 'Email send successfully',
            info: `${info.response}`
          });
    })
  } catch (err) {
    next(err);
  }
}

export const changePassword = async(req:Request,res:Response,next:NextFunction) =>{
  try {
    // const user: UserReturnDb | null = await User.findById(req.params.idUser);
    const user: any = await User.findById(req.params.idUser);
    if(!user){
      return res.status(404).send('Invalid link or expired')
    }
    /** La contraseña que encuentra en el objeto user hay que reeemplazarla por la nueva contraseña
     * que el usuario ingresa en el body.
    */
    user.password = req.body.password;
    user.password = await bcrypt.hashSync(user.password,10);
    await user.save();
    res.status(200).json({
      msg: 'Password update successfully'
    })
  } catch (err) {
    next(err);
  }
}

