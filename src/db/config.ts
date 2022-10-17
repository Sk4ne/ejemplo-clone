import mongoose from 'mongoose'
import express from 'express'
const app = express();

// mongoose.connect(urlDB,{useNewUrlParser:true},(err)=>{
let urlDB = process.env.URL_DB || '';
mongoose.connect(urlDB,(err)=>{
  err ? console.log(`Error connection to the database ${err}`) 
      :  console.log('Connection to the established database');
})
