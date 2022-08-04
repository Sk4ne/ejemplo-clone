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
passport.use("sign-up-facebook", new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/login",
  profileFields: ['id', 'email', 'first_name', 'last_name']
},
  async (accesToken: string, refreshToken: string, profile: any, cb: any) => {
    const { email, first_name }: UserReturn = profile._json;
    /**
     * Si existe un usuario autenticado con facebook:
     * Generar un token para el mismo
     */
    const userReturn = await User.findOne({ email });
    if (userReturn) {
      const token = await generateJWT(userReturn.id);
      const userData = {
        userReturn,
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
      await User.create(dataUser), async function (err: any, user: any, res: Response) {
        console.log(user);
        const token = await generateJWT(user.id);
        const userDb = {
          user,
          token
        }
        return cb(null, userDb);
      }
    }
  }
)); 

