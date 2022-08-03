import dotenv from 'dotenv'
dotenv.config();
import passport from 'passport'
const FacebookStrategy = require('passport-facebook').Strategy;
import { generateJWT } from '../helpers/generateJwt';
import { User } from '../models'

passport.serializeUser((user,done)=>{
  done(null,user); 
})
passport.deserializeUser((user:any,done)=>{
  done(null,user);
})

interface UserReturn {
  email:string;
  first_name?:string;
} 

/** Sign-up facebook */
 passport.use("sign-up-facebook",new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/login",
  profileFields:['id','email','first_name', 'last_name']
},

async(accesToken:string,refreshToken:string,profile:any,cb:any)=>{
  const { email,first_name }:UserReturn = profile._json;
  const user = await User.findOne({email});
  if(user){
    const token = await generateJWT(user.id);
    const userDb = {
      user,
      token 
    }
    console.log('EXISTE USUARIO FACEBOOK')
    return cb(null,user,token);
  }
  if(!user){
    let dataUser = {
      name:first_name,
      email,
      password:':)',
      facebook:true
    }
    await User.create(dataUser),async function(err: any,user: any,res:Response){
      console.log(user);
      const token = await generateJWT(user.id);
      const userDb = {
        user,
        token 
      }
      return cb(err,user,token);
    }
  }

}
)); 

/** Sign in  */

passport.use('sign-in-facebook',new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret:  process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/signin",
  profileFields: ["email", "name", "photos"],
},async(accesToken:string,refreshToken:string,profile:any,cb:any)=>{
  const { id, first_name,email } = profile._json;
  let user = await User.findOne({email});
  if(user){
    const token = await generateJWT(user.id);
    return cb(null,user,token);
  }else{
    return cb(null,false);
  }
}))

