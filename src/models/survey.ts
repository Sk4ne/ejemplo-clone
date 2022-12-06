import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/* enum */
const validTypeQuestion = {
  values: ['QUESTION_OPEN','QUESTION_MULTIPLE'],
  message: '{ VALUE } is not a type question valid'
}

interface Survey extends mongoose.Document{
   titleSurvey: string;
   description: string;
   question:[{
     _id: any;
     titleQuestion: string;
     typeQuestion: string;
    //  answer: string;
     answerO: string;
    //  answerM: string[]
    answerM: {
      options:string[],
      /* La respuesta es cualquiera de las opciones que se encuentra en el array options */
      answer: {type:string, default:''}
    }
   }],
   createAt: Date;
   state:boolean;
}

const surveySchema = new Schema({
  titleSurvey: { type:String },
  description: { type:String},
  question: [{
    titleQuestion: {
      type:String
    },
    typeQuestion: {
      type:String, 
      enum: validTypeQuestion,
    },
    answerO: { type:String,default:''},
    answerM: {   
      options:[ String ], 
      answer: {type:String, default:''} 
    }
  }],
  createAt:{ type:Date,default: Date.now() },
  state:{ type:Boolean, default:true}
},{versionKey:false}); 


/* Apply the uniqueValidator plugin to nameSchema */
surveySchema.plugin(uniqueValidator);
const Survey = mongoose.model<Survey>('Question',surveySchema);

/* Apply the uniqueValidator plugin to surveySchema 
surveySchema.plugin(uniqueValidator, {message: 'Error, expected {PATH} to be unique'});
*/


export default Survey;