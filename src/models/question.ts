import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
/* module for validate data */
import Joi from 'joi';


/*
 * Con mongoose-unique-validator podemos realizar cierto tipo de validaciones, pero existe 
   otra alternativa que es hacerlo directamente con la configuración que mongoose trae por defecto 
*/

/* enum */
const validTypeQuestion = {
  values: ['QUESTION_OPEN','MULTIPLE'],
  message: '{ VALUE } is not a type question valid'
}

interface Question extends mongoose.Document{
   titleSurvey: string;
   description: string;
   question:[{
     titleQuestion: string;
     typeQuestion: string;
     answer: string;
   }],
   createAt: Date;
   state:boolean;
}

/**
 * Una encuesta puede tener una o muchas preguntas por lo que se debe crear
 * una array de objetos para almacenar las preguntas, que solo deben 
 * aceptar dos tipos, QUESTION_OPEN Y MULTIPLE 
*/
const questionSchema = new Schema({
  titleSurvey: {
    type:String,
    required:[true,'title survey is required']
  },
  description: {
    type:String,
    required:[true,'description is required']
  },
  question: [{
    titleQuestion: {
      type:String, 
      required:[true,'title question is required']
    },
    typeQuestion: {
      type:String, 
      enum: validTypeQuestion,
      required:[true,'type question is required']
    },
    answer: {
      type:String,
      default:'NO ANSWER'
    }
  }],
  createAt: {
    type:Date,
    default: Date.now()
  },
  state:  {
    type:Boolean,
    default:true
  }
},{versionKey:false});


/* Apply the uniqueValidator plugin to nameSchema */
questionSchema.plugin(uniqueValidator);
const Question = mongoose.model<Question>('Question',questionSchema);

/* Apply the uniqueValidator plugin to questionSchema 
questionSchema.plugin(uniqueValidator, {message: 'Error, expected {PATH} to be unique'});
*/


export default Question;