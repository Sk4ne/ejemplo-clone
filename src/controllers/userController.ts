import '../upload/cloudinary'
import { User } from '../models'
import { Request,Response,NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'
import { imageUser } from '../../types'


/* addUser without image */

/* export const addUser = async(req:Request, res:Response, next:NextFunction) => {
  try{
    const body:any = req.body;
    const salt:string = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(body.password,salt);
    const user = await User.create(body);
    res.status(200).json(user);
  }catch(err){
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err);
  }
} */


export const addUser = async(req:Request,res:Response,next:NextFunction) =>{
  try {
    let body:any = req.body;
    body.password = await bcrypt.hashSync(body.password,10);
    let pathImage:any;
    pathImage = await req.file?.path; 

    /* If user don't choose an image. Add user with image by default */
    if(!pathImage){
      const user = await User.create(body);
      res.status(200).json({user});
    }else{
      const { secure_url } = await cloudinary.uploader.upload(pathImage,{folder:'api-survey/'});
      body.img = secure_url; 
      const user = await User.create(body); 
      res.status(200).json({user});
    }
  } catch (err) {
    res.status(500).send({
      // msg:`An ocurred error  ${err}`
      msg:err
    }) 
    next(err);
  }
}
export const getUsers = async(req:Request, res: Response, next: NextFunction)=> {
  try {
    const users  = await User.find({});
    res.status(200).json(users);  
  } catch (err) {
    res.status(500).json({
      message: ` An error ocurred ${err}`  
    })  
    next(err)
  }
}

export const getUser = async(req:Request, res: Response, next: NextFunction) =>{
  try {
    let { id } = req.params
    const userID  = await User.findById(id);
    if(!userID){
      res.status(404).json({msg:"user don't exist"})
    }else{
      res.status(200).json({userID});  
    }
  } catch (err) {
    res.status(500).json({
      message: ` An error ocurred ${err}`  
    })  
    next(err);
  }
}

export const updateUser = async(req:Request, res: Response, next: NextFunction) => {
  /**
   * If I don't send the image when updating a user. 
   * Multer gives me an error saying that it did not find the file parameter.
  */
  try{
    let { id }  = req.params;
    let update = req.body;
    let pathImage:any = await req.file?.path;
    /* Validar contraseña contra DB */
    const salt = bcrypt.genSaltSync(10);
    if(req.body.password){
      req.body.password = bcrypt.hashSync(req.body.password, salt); 
    }
    if(!req.file){
      // let userToUpdate = await User.findById(id);
      let updateUser = await User.findByIdAndUpdate(id,update,{new:true});
      res.status(200).json({
        msg: 'User updated...',
        updateUser 
      })
    }else{
      /* We delete the existing image in cloudinary and replace it with a new one. */
      let imgUser = await User.findById(id);
      const nameArr:string[] | undefined = imgUser?.img.split('/');
      if(nameArr!=undefined) {
        const name = nameArr[nameArr.length -1];
        const [ public_id] = name.split('.');
        await cloudinary.uploader.destroy(`api-survey/${public_id}`)
      }

      const {secure_url } = await cloudinary.uploader.upload(pathImage,{folder:'api-survey/'});
      let data = {
        img: secure_url,
        ...update
      }
      let updateUser = await User.findByIdAndUpdate(id,data,{new:true});
      res.status(200).json({
        msg: 'User updated...',
        updateUser
      })
    }
  }catch(err){
    res.status(500).json({
      message: 'An error ocurred',
      err
    })
    next(err)
  }
}

export const deleteUser = async(req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.params;
    /** Change state true to false 
    * await User.findByIdAndUpdate(id,{state:false},{new:true});
    */
    const imgU = await User.findById(id);
    if(imgU?.img){
      const nameArr = imgU?.img.split('/');
      const name = nameArr[nameArr.length -1];
      const [ public_id] = name.split('.');
      await cloudinary.uploader.destroy(`api-survey/${public_id}`);
    }
    await User.findByIdAndDelete(id); 
    res.status(200).json({
      message: 'User delete successfully',
    })
  }catch(err){
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err)
  }
}

export const deleteAllUsers = async(req:Request,res:Response,next:NextFunction) => {
  try{
    await User.deleteMany({})
    res.status(200).json({
      msg:'All user was deleted successfully'
    })
  }catch(err){
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err)
  }
}

/* This function is for test. Update role of all document of collection user */

export const updateDoc = async(req:Request,res:Response,next:NextFunction)=>{
  try {
    /* update all role user */
    await User.updateMany({},{$set:{role:'ADMIN_ROLE'}});
    res.status(200).json({msg:'All documents was updated'});
  } catch (err) {
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err)
  }
}

/* Function to controle user no auth */
export const noAuth = async(req:Request,res:Response,next:NextFunction)=>{
  try {
    res.json({
      msg: 'No estas logueado, hazlo...'
    })
  } catch (err) {
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err)
  }
}

export const loginOk = async(req:Request,res:Response,next:NextFunction)=>{
  try {
    res.json({
      msg: 'login ok...'
    })
  } catch (err) {
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err)
  }
}