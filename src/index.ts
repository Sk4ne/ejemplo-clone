import dotenv from 'dotenv'
dotenv.config()
import './db/config'
import passport from 'passport'
'./middlewares/authGoogle'
'./middlewares/authFacebook'
import express, { Request,Response} from 'express'
import morgan from 'morgan'
import cors from 'cors'
import session from 'express-session'

import router from './routes'
const app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());
// passport.use('facebook',strategies.facebook);

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

//application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//MIDDLEWARES ROUTES
app.use(router);
/** midleware router google */
/* app.use(passport.authenticate('sign-up-facebook'))
app.use(passport.authenticate('sign-up-google')) */
/* app.use('/auth',passport.authenticate('sign-up-google',{
  scope:[
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ],
  session:false
}),router); */

app.use(express.static('public'));
const history = require('connect-history-api-fallback');
app.use(history());


// connection database

app.listen(process.env.PORT || 3000,()=>{
  console.log(`Listen on port ${process.env.PORT}`)  
})
