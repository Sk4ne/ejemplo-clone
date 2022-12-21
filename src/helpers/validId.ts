import { Survey,User } from "../models";
import { Types } from 'mongoose';

export const existMongoId = async(id:string | Types.ObjectId) => {
  const idMongo = await Survey.findById(id)
  if(!idMongo){
    throw new Error(`Dont exist and survey with id ${id}`)
  }
}

export const existMongoIdUser = async(id:string | Types.ObjectId) => {
  const idMongo = await User.findById(id);
  if(!idMongo){
    throw new Error(`Dont exist and user with id ${id}`);
  }
}