/* export {};

declare global {
  namespace Express {
    interface Request {
      user: {name:string,role:string};
    }
  }
}
 */
import { Types } from "mongoose";

export interface UserReturnGoogle {
  email:string;
  given_name:string;
  provider?:string;
} 

export interface UserReturnFacebook {
  first_name:string; 
  email:string;
} 

export interface ProfileFacebook{
  _json:{
    id:string;
    email:string;
    first_name:string;
    last_name?:string; 
  }
}
export interface ProfileGoogle{
  _json:{
    sub:string;
    given_name:string;
    email:string;
    family_name?:string; 
  }
}

export interface UserFacebook{
  _id: string | Types.ObjectId;
  name: string;
  email: string;
  password: string;
  img: string;
  role: string;
  facebook: boolean;
  google: boolean;
  createAt: date,
  state: boolean
}


export interface QuestionObject{
  [
    {
      _id: string | Types.ObjectId,
      titleQuestion: string,
      typeQuestion: string,
      answer: string
    }
  ]
}


export interface questionOpen {
  _id:Types.ObjectId,
  titleSurvey:string,
  description:string,
  question: [
    {
      _id:string,
      titleQuestion:string,
      typeQuestion:string,
      answerO:string
    }
  ]
}

export interface questionMultiple extends questionOpen {
  question: [
    {
      _id:string,
      titleQuestion:string,
      typeQuestion:string,
      answerM: {
        options:[ string ],
        /* La respuesta es cualquiera de las opciones que se encuentra en el array options */
        answer: {type:string, default:''}
      }
    }
  ]
}

export interface returnQuestionById {
    _id: Types.ObjectId | string;
    titleSurvey: string;
    description: string;
    question: [
      {
        answerM: {
          "options":string[],
          "answer":string
        },
        titleQuestion: string,
        typeQuestion: string,
        answerO: string,
        _id: Types.ObjectId | string
      }
    ],
    createAt: Date;
    state: boolean;
}

export interface questionArray {
  [
    {
      answerM: { options: [string], answer: string },
      titleQuestion: string,
      typeQuestion: string,
      answerO: string,
      _id: Types.ObjectId | string
    }
  ]
}


/* Types and interfaces surveycontrollers */
type infoQuestion = {
  _id:string | Types.ObjectId,
  titleSurvey:string,
  descripcion:string,
  question: [
    {
      _id:string,
      titleQuestion:string,
      typeQuestion:string,
      answer:string
    }
  ]
}
interface answerQuestionOpen {
  titleQuestion:string;
  typeQuestion:string;
  answerO:string;
}
interface answerQuestionMultiple {
  titleQuestion:string;
  typeQuestion:string;
   answerM: {
    options: [string],
    answer: string
  },
}

type infoUser = {
  _id:Types.ObjectId,
  titleSurvey:string,
  descripcion:string,
  question: [
    {
      _id:string,
      titleQuestion:string,
      typeQuestion:string,
      answer:string
    }
  ]
}