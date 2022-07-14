import mongoose, { Schema } from "mongoose";

interface User extends mongoose.Document{
  name:string;
  email:string;
  password:string;
  // image opcional
  img?:string;
  role:string;
  createAt: Date;
  state: boolean 
}
const UserSchema = new Schema({
  name: {type: String,required:[true,'Name required']},
  email: {type:String, unique: true,required: [true,'email is required']},
  password: {type: String, required:[true, 'Password is required']},
  img: {type:String},
  role: {type:String, enum: ['ADMIN'],default: 'ADMIN'},
  state: {type: Boolean,default:true},
  createAt: {type: Date, default: new Date()}
},{versionKey:false})

const User = mongoose.model<User>('User',UserSchema);
export default User; 