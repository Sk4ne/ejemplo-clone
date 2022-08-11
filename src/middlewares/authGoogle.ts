import passport from 'passport'
const GoogleStrategy = require('passport-google-oauth2').Strategy
import { Request } from 'express'
import { User } from '../models'
import { generateJWT } from '../helpers/generateJwt'
import { ProfileGoogle, UserReturnGoogle } from '../types'
import { Types } from 'mongoose'

passport.serializeUser((user,done)=>{
  done(null,user); 
})
passport.deserializeUser((user:any,done)=>{
  done(null,user);
})


passport.use('sign-up-google',new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL_LOCAL_GOOGLE,
  passReqToCallback   : true,
  /* new */
  scope: ['profile', 'email']
},
async(_req:Request, _accessToken:string, _refreshToken:string, profile:ProfileGoogle, done:any)=>{
  const {given_name,email}:UserReturnGoogle = profile._json;
  let user = await User.findOne({email});
  if (user && user?.google===true) {
    const token = await generateJWT(user.id);
    const userData = {
      user,
      token
    }
    return done(null, userData);
  } else {
    let dataUser = {
      name: given_name,
      email,
      password: ':)',
      google: true,
    }
    let newUser = await User.create(dataUser);
     let ID_USER: string | Types.ObjectId  = newUser._id;
     /**generate token user */
     const token = await generateJWT(ID_USER); 
     let userDB = {
        newUser,
        token
     }
     return done(null,userDB);
  } 
}
));
