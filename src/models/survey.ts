import mongoose, { Schema, Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { ObjectId } from 'mongoose';

/* enum */
const validTypeQuestion = {
  values: ['QUESTION_OPEN','QUESTION_MULTIPLE'],
  message: '{VALUE} is not a type question valid'
}

/* NUEVO */
enum typeQuestionValid {
  open = 'QUESTION_OPEN',
  multiple = 'QUESTION_MULTIPLE' 
}

interface Survey extends mongoose.Document{
   titleSurvey: string;
   description: string;
   question:[{
     _id: any;
     titleQuestion: string;
     typeQuestion: string;
     answerO: string;
    answerM: {
      options:string[],
      answer: {type:string, default:''}
    }
   }],
   /* New Data */
   user: Types.ObjectId,
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
    },
    answerO: { type:String,default:''},
    answerM: {   
      options: {type : [String], default:''}, 
      answer: {type:String, default:''} 
    }
  }],
  user: {type: Schema.Types.ObjectId,ref:'User'},
  createAt:{ type:Date,default: Date.now()},
  state:{ type:Boolean, default:true}
},{versionKey:false}); 


/* Apply the uniqueValidator plugin to nameSchema */
surveySchema.plugin(uniqueValidator);
const Survey = mongoose.model<Survey>('Question',surveySchema);

export default Survey;