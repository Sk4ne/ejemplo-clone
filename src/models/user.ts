import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator';
const validRole = {
  values: ['ADMIN_ROLE','USER_ROLE'],
  message: '{VALUE} is not a valid role'
}


interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  /* img? is optional */
  img: string;
  role: string;
  createAt: Date;
  state: boolean
}

const userSchema = new Schema({
  name: {type:  String},
  email:  {type:  String},
  password: {type:  String},
  img:  {type:  String,default:'https://res.cloudinary.com/dqhme1rod/image/upload/v1658509371/api-survey/v6hbtbahx2gfzmupgxsz.png'},
  role: {type:  String, enum: validRole, default: 'ADMIN_ROLE'},
  createAt: {type:  Date, default: Date.now()},
  state:  {type:  Boolean, default: true},
},{versionKey:false})

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User',userSchema);

export default User; 
