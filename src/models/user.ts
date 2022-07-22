import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator';
const validRole = {
  values: ['ADMIN'],
  message: '{VALUE} is not a valid role'
}


interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  /* img is optional */
  img?: string;
  role: string;
  createAt: Date;
  state: boolean
}

const userSchema = new Schema({
  name: {type:  String},
  email:  {type:  String},
  password: {type:  String},
  img:  {type:  String},
  role: {type:  String, enum: validRole, default: 'ADMIN'},
  createAt: {type:  Date, default: Date.now()},
  state:  {type:  Boolean, default: true},
},{versionKey:false})

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User',userSchema);

export default User; 