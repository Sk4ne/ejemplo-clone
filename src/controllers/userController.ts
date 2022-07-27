import { User } from '../models'
import { Request,Response,NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import '../upload/cloudinary'
import { v2 as cloudinary } from 'cloudinary'

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
    const result = await cloudinary.uploader.upload(pathImage,{folder:'api-survey/'});
    body.img = result.secure_url;
    const user = await User.create(body); 
    res.status(200).json({user});
  } catch (err) {
    res.status(500).send({
      msg:`An ocurred error  ${err}`
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
    const user  = await User.findById(id);
    res.status(200).json(user);  
  } catch (err) {
    res.status(500).json({
      message: ` An error ocurred ${err}`  
    })  
    next(err);
  }
}

export const updateUser = async(req:Request, res: Response, next: NextFunction) => {
  try{
    let { id }  = req.params;
    let update = req.body;
    /* Validar contraseña contra DB */
    const salt = bcrypt.genSaltSync(10);
    if(req.body.password){
      req.body.password = bcrypt.hashSync(req.body.password, salt); 
    }
    await User.findByIdAndUpdate(id,update,{new:true})
    res.status(200).json({message: 'User update'});
  }catch(err){
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err)
  }
}

export const deleteUser = async(req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.params;
    /**
     * Change state true to false 
    */
    /* await User.findByIdAndUpdate(id,{state:false},{new:true}); */

    /**
     * Delete from DB
    **/
    await User.findByIdAndDelete(id); 
    res.status(200).json({
      message: 'User delete successfully'
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