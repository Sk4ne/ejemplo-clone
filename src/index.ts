import dotenv from 'dotenv'
dotenv.config()
import './db/config'
import passport from 'passport'
'./middlewares/authGoogle'
'./middlewares/authFacebook'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import session from 'express-session'

/** routes v1 */
import router from './routes/v1'
const app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

/**application/x-www-form-urlencoded */
app.use(express.urlencoded({ extended: true }));

/** Middlewares router */
app.use('/v1',router);

app.use(express.static('public'));
const history = require('connect-history-api-fallback');
app.use(history());


/** Connection database */
app.listen(process.env.PORT || 3000,()=>{
  console.log(`Listen on port ${process.env.PORT}`)  
})
