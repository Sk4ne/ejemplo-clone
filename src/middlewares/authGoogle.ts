import passport from 'passport'
/**
 * I have a error using:  
 * import GoogleStrategy from 'passport-google-oauth2'
 * GoogleStrategy.Strategy
 */
const GoogleStrategy = require('passport-google-oauth2').Strategy
import { Request } from 'express'
import { User } from '../models'
import { generateJWT } from '../helpers/generateJwt'

passport.serializeUser((user,done)=>{
  done(null,user); 
})
passport.deserializeUser((user:any,done)=>{
  done(null,user);
})

interface UserReturn {
  email:string;
  given_name:string;
  /* picture: string; */
  provider:string;
} 

passport.use('sign-up-google',new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/login",
  passReqToCallback   : true
},
async(_req:Request, _accessToken:string, _refreshToken:string, profile:any, done:any)=>{
  const {given_name,email/* ,picture  */}:UserReturn = profile._json;
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
      /** Se va a usar una imagen por defecto */
     /*  img: picture, */
      google: true,
    }
    await User.create(dataUser), async function (err: any, user: any, res: Response) {
      console.log(user);
      const token = await generateJWT(user.id);
      const userDb = {
        user,
        token
      }
      return done(null, userDb);
    }
  } 
  /* :) */
}
));

