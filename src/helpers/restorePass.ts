import { User } from '../models'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'
import { Request, Response,NextFunction } from 'express'
import { ObjectId } from 'mongoose'
import moment from 'moment'
/* NEW 16 ABRIL 2023 */
import jwt from 'jsonwebtoken'

interface UserReturnDb {
  save(): string | PromiseLike<string>
  _id: ObjectId | string;
  name: string;
  email: string;
  password: string;
  img: string;
  role: string;
  facebook: boolean;
  google: boolean;
  securityToken:string;
  createAt: Date;
  state: boolean;
}

export const restorePassword = async(req:Request,res:Response,next:NextFunction) => {
  try {

    let user:UserReturnDb | null = await User.findOne({email:req.body.email});
    let payload = { id:user?._id };
    /* PASAR UN TOKEN RANDON POR RAZONES DE SEGURIDAD */
    let token = jwt.sign({data: 'lycaon'},process.env.SECRET_OR_PRIVATE_KEY as string,{expiresIn: '10M'});
    let decode:any = await jwt.verify(token,process.env.SECRET_OR_PRIVATE_KEY as string);
    
    if(!user?.email || user?.email == ''){
      return res.status(404).send("Don't exist and user with this email in the database");
    }
    let link = `${process.env.BASE_URL}/password-reset/${user._id}/${token}`
    user.securityToken = await token;
    /* Save securityToken in database */
    let sav: string = await user.save();
    // console.log(token) 
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
      text: "Hello world?",
      html: //html
      `
        <h3>
          Haz solicitado restablecer la contraseña de cuenta en la pagina survey S.A.S \n para cambiarla por favor pulsa el boton
        </h3>
        <br><br><br>
        <a href="${link}" style='background-color:blue; color:white; padding:20px;text-decoration:none; border-radius:50px;font-size:18px'>Cambiar Contrasena</a>
        <br><br>
      
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
    res.status(401).json({
      msg: 'ALGUN ERROR OCURRIO!!!'
    })
    next(err);
  }
}

export const changePassword = async(req:Request,res:Response,next:NextFunction) =>{
  try {
    // const user: UserReturnDb | null = await User.findById(req.params.idUser);
    const user: any = await User.findById(req.params.idUser);
    /* VERIFICAR SI EL TOKEN ES VALIDO O EXPIRO */

    const unixTimestamp = 1620000000;
    const dateNow = Date.now() / 1000
    console.log(`date now: ${dateNow}`)
    let decoded:any =  jwt.verify(user.securityToken,process.env.SECRET_OR_PRIVATE_KEY as string)
    console.log(`TOKEN EXPIRES: ${decoded.exp}`)
    // if (!(user && decoded.exp <= moment.unix(unixTimestamp))) {
    if ( !user || decoded.exp < Date.now() / 1000) {
      return res.status(401).json('Invalid link or token expired')
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
    res.status(401).json({
      msg: 'El link para reestablecer la contrasena expiro recuerde que solo tiene 5 minutos para realizar este proceso.!!!'
    })
    next(err);
  }
}

