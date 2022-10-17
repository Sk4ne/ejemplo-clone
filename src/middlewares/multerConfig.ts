// import dotenv from 'dotenv';
// dotenv.config();
import { Request} from 'express';
import multer from 'multer';

/**
 * Arrays TS: Array<string>
 * :string[]
*/

export const storage : any = multer({
  storage: multer.diskStorage({}),
  /* With this function we control which files should be uploaded and which should be skipped.   */
  fileFilter: (req:Request,file,cb) => {
    let validExtens :string[] = ['png','jpeg','svg','jpg'];
    if(file.mimetype.match(/png|jpeg|svg|jpg/gi)=== null){
      throw new Error(`Image not supported. Allowed extension ${validExtens}`)
    }else{
      cb(null,true);
    }
  }
})

