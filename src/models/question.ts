import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

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

const questionSchema = new Schema({
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
    answer: {
      type:String
    }
  }],
  createAt:{ type:Date,default: Date.now() },
  state:{ type:Boolean, default:true}
},{versionKey:false}); 


/* Apply the uniqueValidator plugin to nameSchema */
questionSchema.plugin(uniqueValidator);
const Question = mongoose.model<Question>('Question',questionSchema);

/* Apply the uniqueValidator plugin to questionSchema 
questionSchema.plugin(uniqueValidator, {message: 'Error, expected {PATH} to be unique'});
*/


export default Question;