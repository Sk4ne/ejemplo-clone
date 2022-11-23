/*================================== 
*           Imports
 I. export const addQuestion = async(req,res,next)=>{..code}
 II. exports.addQuestion = async(req,res,next)=>{..code}
 III. module.exports = {..code}
 IV. export default {..code}
==================================*/
import Survey from '../models/survey'
import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose';

export const addSurvey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const survey = await Survey.create(body);
    res.status(201).json(survey);
  } catch (err) {
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err);
  }
}

export const getSurveys = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const surveys = await Survey.find({});
    res.status(200).json(surveys);
  } catch (err) {
    res.status(500).json({
      message: ` An error ocurred ${err}`
    })
    next(err);
  }
}

export const getSurvey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.params
    const survey = await Survey.findById(id);
    res.status(200).json(survey);
  } catch (err) {
    res.status(500).json({
      message: ` An error ocurred ${err}`
    })
    next(err);
  }
}
/**
 * Obtener un survey con una pregunta en especifico
 */
export const getSurveyQuestion = async(req:Request,res:Response,next:NextFunction)=>{
  try{
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
    let { idSurvey }  = req.params; 
    let { idQuestion } = req.params;
    const surveyId: infoUser | null =  await Survey.findById(idSurvey);
    let surveyQuestion = surveyId?.question.find(elem => elem._id == idQuestion);
    return res.status(200).json({
      surveyQuestion
    })
  }catch(err){
    res.status(500).json({
      message: ` An error ocurred ${err}`
    })
    next(err);
  }
}
/** 
 * Agregar una nueva pregunta al array de objetos questions
 * 
*/
export const pushQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    type infoQuestion = {
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

    let { idElement } = req.params;
    let { titleQuestion, typeQuestion, answer } = req.body;
    if( !(typeQuestion === 'QUESTION_OPEN' || typeQuestion === 'QUESTION_MULTIPLE' ) ){
      return res.status(404).json({msg:`${typeQuestion} is not typeQuestion valid :)`});
    }
    if(typeQuestion === 'QUESTION_OPEN'){
      await Survey.updateOne(
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
      let questionPush:any = await Survey.findById(idElement);
      return res.status(200).json(questionPush);
    }else{
      let options = [];
      let opt = 0;
      let opt2 = 0;
      let opt3 = 0;
      await Survey.updateOne(
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
      let questionPush:infoQuestion | null = await Survey.findById(idElement);
      return res.status(200).json(questionPush);
    }
  } catch (err) {
    res.status(500).json({
      message: ` An error ocurred ${err}`
    })
    next(err);
  }
}

export const updateSurvey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.params;
    let update = req.body;
    let surveyUpdate = await Survey.findByIdAndUpdate(id, update, { new: true })
    res.status(200).json({ 
      msg: 'Survey update',
      surveyUpdate 
    });
  } catch (err) {
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err);
  }
}

/**
 * Responder una pregunta en el array de objetos questions
 */
export const updateSubQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.params;
    /** Paso como parametro el id de la pregunta que quiero responder */
    let { idQuestion } = req.params; 
    let update = req.body;
    /** Obtengo todo el objeto por medio del findById de mongoose */
    let questionById = await Survey.findById(id);
    /** Obtengo todo el array de preguntas */
    let questionEmbedded = questionById?.question;
    /** Retorno el primer objeto cuya pregunta sea un string vacio */
    /** variable result return undefined */
    /* let result = questionEmbedded?.find(question=>{
      return question._id === idQuestion;
    }); */
    /**
     * Recorro el array de objetos de preguntas y guardo en un array todos los IDS de las mismas.
     */

    const idQuestion2:string[] | undefined = questionEmbedded?.map((elem)=>{
      return elem._id;
    });

    
    let { answerClient } = req.body;
    let subQuestionUpdated;
    if(idQuestion2!== undefined){
      subQuestionUpdated = await Survey.updateOne(
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
export const deleteSurvey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.params;
    await Survey.findByIdAndDelete({_id: id});
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

export const deleteAllSurvey = async(req:Request, res: Response, next:NextFunction) => {
  try{
    await Survey.deleteMany({});
    res.status(200).json({msg:'All documents was deleted'})
  }catch(err){
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err);
  }
}

/**
 * Delete one question
 */
export const deleteQuestion = async(req:Request,res:Response,next:NextFunction)=>{
  try {
    let { idSurvey }  = req.params; 
    let { idQuestion } = req.params;

    // OBTENER UNA ENCUESTA
    type arrayQ = [
      {
        _id: string, 
        titleQuestion: string,
        typeQuestion: string,
        answer: string
      }
    ]

    let questionById/*:questionByIdReturn | null*/ = await Survey.findById(idSurvey);
    
    // OBTENGO EL ARREGLO DE PREGUNTAS
    let arrayQuestion:arrayQ | undefined = questionById?.question;
    let questionD = arrayQuestion?.find(element => element._id == idQuestion);
    let deleteEl = questionD?._id;
    const questionDelete = await Survey.updateOne({_id:idSurvey},{$pull: {question: {_id: deleteEl}}});
    return res.status(200).json({
      questionDelete
    })
  } catch (err) {
    res.status(500).json({
      message:`An error ocurred ${err}`
    })
  }
}
