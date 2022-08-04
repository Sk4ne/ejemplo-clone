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

passport.use('sign-up-google',new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/login",
  passReqToCallback   : true
},
async(req:Request, accessToken:string, refreshToken:string, profile:any, done:any)=>{
  const {given_name,email } = profile._json;

  let userReturn = await User.findOne({email});
  if (userReturn) {
    const token = await generateJWT(userReturn.id);
    const userData = {
      userReturn,
      token
    }
    return done(null, userData);
  } else {
    let dataUser = {
      name: given_name,
      email,
      password: ':)',
      google: true
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