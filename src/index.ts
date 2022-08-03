import dotenv from 'dotenv'
dotenv.config()
import './db/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
// import strategies from '../src/middlewares/authFacebook'
import router from './routes'
const app = express();

/** Middleware authFacebook */
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
app.use(express.static('public'));
const history = require('connect-history-api-fallback');
app.use(history());


// connection database

app.listen(process.env.PORT || 3000,()=>{
  console.log(`Listen on port ${process.env.PORT}`)  
})
