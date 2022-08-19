/*================================== 
*           Imports
 I. export const addQuestion = async(req,res,next)=>{..code}
 II. exports.addQuestion = async(req,res,next)=>{..code}
 III. module.exports = {..code}
 IV. export default {..code}
==================================*/
import Question from '../models/question'
import { Request, Response, NextFunction } from 'express'
import { QuestionObject } from '../types';

/**
 * Succesfully - /questions - GET
 * Successfully - /question/:id - GET ID 
 * Successfully - /question - POST
 * Successfully - /push-question/:id PUT - subQuestions 
 * Sucessfully - /question/:id - PUT 
 * Successfully - /question/:id - DELETE
 */
export const addQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const question = await Question.create(body);
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err);
  }
}

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = await Question.find({});
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({
      message: ` An error ocurred ${err}`
    })
    next(err);
  }
}

export const getQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.params
    const question = await Question.findById(id);
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({
      message: ` An error ocurred ${err}`
    })
    next(err);
  }
}
/** 
 * New Question
 * 
*/
export const pushQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { idElement } = req.params;
    let { titleQuestion, typeQuestion, answer } = req.body;

    if( !(typeQuestion === 'QUESTION_OPEN' || typeQuestion === 'QUESTION_MULTIPLE' ) ){
      return res.status(404).json({msg:`${typeQuestion} is not typeQuestion valid :)`});
    }
    /* Push new question to array-object questions */
    /**
     * Push new question to array-object questions
     * structure
     * "survey":[
     *  { 
     *     "titleSurvey":"title",
     *     "description":"Description survey"
     *  },
     *  "question":[
     *     {
     *       "titleQuestion":"titleQuestion",
     *       "typeQuestion":"QUESTION_OPEN",
     *       "answer":""   
     *     } 
     *  ]
     * ]
     */
    await Question.updateOne(
      {_id:idElement },
      {
        $push: {
          question: {
            titleQuestion: titleQuestion,
            typeQuestion: typeQuestion,
            answer: answer
          }
        }
    });
    let questionPush:any = await Question.findById(idElement);
    return res.status(200).json(questionPush);
  } catch (err) {
    res.status(500).json({
      message: ` An error ocurred ${err}`
    })
    next(err);
  }
}

export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.params;
    let update = req.body;
    let questionUpdate = await Question.findByIdAndUpdate(id, update, { new: true })
    res.status(200).json({ 
      msg: 'Question update',
      questionUpdate 
    });
  } catch (err) {
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err);
  }
}

export const updateSubQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.params;
    /** Paso como parametro el id de la pregunta que quiero responder */
    let { idQuestion } = req.params; 
    let update = req.body;
    /** Obtengo todo el objeto por medio del findById de mongoose */
    let questionById = await Question.findById(id);
    /** Obtengo todo el array de preguntas */
    let questionEmbedded = questionById?.question;
    /** Retorno el primer objeto cuya pregunta sea un string vacio */
    /** variable result return undefined */
    let result = questionEmbedded?.find(question=>{
      return question._id === idQuestion;
    });
    /**
     * Recorro el array de objetos de preguntas y guardo en un array todos los IDS de las mismas.
     */
    const idQuestion2:string[] | undefined = questionEmbedded?.map((elem)=>{
      return elem._id;
    });
    let { answerClient } = req.body;
    let subQuestionUpdated;
    if(idQuestion2!== undefined){
      subQuestionUpdated = await Question.updateOne(
        // {_id:id,'question._id':idQuestion2[3]},

        /** By passing the question id as a parameter, i can update
         * the qeustion answer dynamically
         */
        {_id:id,'question._id':idQuestion},
        {$set:{'question.$.answer':answerClient}}
      );
    }
    res.status(200).json({
      message: 'Question updated',
      subQuestionUpdated
    })
  } catch (err) {
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err);
  }
}
export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.params;
    /** await Question.findByIdAndDelete(id)  */
    await Question.findByIdAndDelete({_id: id});
    res.status(200).json({
      message: 'Question deleted'
    })
  } catch (err) {
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err);
  }
}

/**
 * Delete all documents of collection question
 */

export const deleteAllQuestion = async(req:Request, res: Response, next:NextFunction) => {
  try{
    await Question.deleteMany({});
    res.status(200).json({msg:'All documents was deleted'})
  }catch(err){
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err);
  }
}

