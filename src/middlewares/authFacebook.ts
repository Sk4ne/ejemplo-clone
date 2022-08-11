import { Types } from 'mongoose';
import passport from 'passport'
const FacebookStrategy = require('passport-facebook').Strategy;
import { generateJWT } from '../helpers/generateJwt';
import { User } from '../models'
import { ProfileFacebook, UserReturnFacebook } from '../types';

passport.serializeUser((user,done)=>{
  done(null,user); 
})
passport.deserializeUser((user:any,done)=>{
  done(null,user);
})

/** Sign-up facebook */
passport.use("sign-up-facebook", new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.CALLBACK_URL_LOCAL_FACEBOOK,
  profileFields: ['id', 'email', 'first_name', 'last_name']
},
  async (_accesToken: string, _refreshToken: string, profile:ProfileFacebook, cb: any) => {
    const { email, first_name }:UserReturnFacebook = profile._json;
    const user = await User.findOne({ email });
    if (user && user?.facebook===true) {
      const token = await generateJWT(user.id);
      const userData = {
        user,
        token
      }
      return cb(null, userData);
    } else {
      let dataUser = {
        name: first_name,
        email,
        password: ':)',
        facebook: true
      }
     
     let newUser = await User.create(dataUser);
     let ID_USER: string | Types.ObjectId  = newUser._id;
     /**generate token user */
     const token = await generateJWT(ID_USER); 
     let userDB = {
        newUser,
        token
     }
     return cb(null,userDB);
      
    }
  }
)); 
