/* export {};

declare global {
  namespace Express {
    interface Request {
      user: {name:string,role:string};
    }
  }
}
 */
import { Types } from "mongoose";

export interface UserReturnGoogle {
  email:string;
  given_name:string;
  provider:string;
} 

export interface UserReturnFacebook {
  first_name:string; 
  email:string;
} 

export interface ProfileFacebook{
  _json:{
    id:string;
    email:string;
    first_name:string;
    last_name?:string; 
  }
}

export interface UserFacebook{
  _id: string | Types.ObjectId;
  name: string;
  email: string;
  password: string;
  img: string;
  role: string;
  facebook: boolean;
  google: boolean;
  createAt: date,
  state: boolean
}