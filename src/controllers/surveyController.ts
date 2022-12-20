/*================================== 
*           Imports
 I. export const addQuestion = async(req,res,next)=>{..code}
 II. exports.addQuestion = async(req,res,next)=>{..code}
 III. module.exports = {..code}
 IV. export default {..code}
==================================*/
import Survey from '../models/survey'
import { Request, Response, NextFunction } from 'express'
import {
  infoQuestion,
  questionReturn,
  /* infoUser, */ surveyById, returnQuestion, question
} from '../types';

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
    const survey:surveyById | null = await Survey.findById(id);
    res.status(200).json(survey);
  } catch (err) {
    res.status(500).json({
      message: ` An error ocurred ${err}`
    })
    next(err);
  }
}
//* Obtener un survey con una pregunta en especifico

export const getSurveyQuestion = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    let { idSurvey }  = req.params; 
    let { idQuestion } = req.params;
    //* Convertir un id de mongodb a string. idMongo.toString()
    const surveyId: surveyById | null =  await Survey.findById(idSurvey);
    let surveyQuestion = surveyId?.question.find(elem => elem._id == idQuestion);
    if(!surveyQuestion){
      return res.status(404).json({
        message: `Dont exist question with this ID ${ idQuestion }`
      })
    }
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
 * * Agregar una nueva pregunta al array de objetos questions
 * 
*/
export const pushQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {

    /* PREGUNTAS ABIERTAS  */

    let idElement :string = req.params.idSurvey;
    // let { titleQuestion, typeQuestion, answerO}:answerQuestionOpen = req.body;
    let preg:any/* questionReturn */ = req.body.question;
    // return console.log(preg);
    let tipoPregunta:string = preg[0]['typeQuestion'];
    let opciones:string[] = preg[0]['answerM']['options'];
    let respMultiple:string = preg[0]['answerM']['answer'];
    let respOpen:string = preg[0]['answerO'];
    let tituloPregunta:string = preg[0]['titleQuestion'];

    if( !(tipoPregunta === 'QUESTION_OPEN' || tipoPregunta === 'QUESTION_MULTIPLE'  )){
      return res.status(404).json({msg:`${tipoPregunta} is not valid ddsdfdf :)`});
    }
    if(tipoPregunta === 'QUESTION_OPEN'){
      await Survey.updateOne(
        {_id:idElement },
        {
          $push: {
            question: {  
              /* question multiple */
              answerM: {
                options: [],
                answer: ""
              },
              titleQuestion: tituloPregunta,
              typeQuestion: tipoPregunta,
              answerO: respOpen
            }
          }
      });
      let questionPush:infoQuestion | null = await Survey.findById(idElement);
      return res.status(200).json(questionPush); 
    }
    if(tipoPregunta === 'QUESTION_MULTIPLE'){
      /* PREGUNTAS DE SELECCION MULTIPLE  */
      await Survey.updateOne(
        {_id:idElement },
        {     
          $push: {
            question: {
              titleQuestion: tituloPregunta,
              typeQuestion: tipoPregunta,   
              answerM: {
                options: opciones,
                answer: respMultiple
             },
            }
          }
      });
      let questionPush:infoQuestion | null = await Survey.findById(idElement);
      return res.status(200).json(questionPush);
    }
  } catch (err) {
    res.status(500).json({
      err
      // message: ` An error ocurred ${err}`
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
    /* id survey */
    let { id } = req.params;
    /* id question */
    let { idQuestion } = req.params; 
    let questionById = await Survey.findById(id);
    /** Obtengo todo el array de preguntas */
    let questionEmbedded = questionById?.question;
    const verifyQuestionUndefined:string[] | undefined = questionEmbedded?.map((elem)=>{
      return elem._id;
    });
    const surveyId: surveyById | null =  await Survey.findById(id);
    let surveyQuestion = surveyId?.question.find(elem => elem._id == idQuestion);

    if(!surveyQuestion){
      return res.status(404).json({
        message: `Dont exist question with this ID ${ idQuestion }`
      })
    }
    /* Obtengo el typeQuestion  */
    let typeQuestion:string | undefined = surveyQuestion?.typeQuestion; 

    if(typeQuestion === 'QUESTION_MULTIPLE'){
      let { answerMultiple } = req.body;

      let subQuestionUpdated:any;
      if(verifyQuestionUndefined!== undefined){
         subQuestionUpdated = await Survey.updateOne(
          {"_id": id},{$set: {"question.$[answ].answerM.answer": answerMultiple}},{arrayFilters:[{"answ._id": idQuestion}]})
      }
      res.status(200).json({
        message: 'Question updated',
        subQuestionUpdated
      })
    }
    if(typeQuestion === 'QUESTION_OPEN'){
      let { answerOpen } = req.body;
      let subQuestionUpdated:any;
      if(verifyQuestionUndefined!== undefined){
        subQuestionUpdated = await Survey.updateOne(
          {_id:id,'question._id':idQuestion},
          {$set:{'question.$.answerO':answerOpen}}
        );
      }
      res.status(200).json({
        message: 'Question updated',
        subQuestionUpdated
      })
    }

  } catch (err) {
    res.status(500).json({
      message: `An error ocurred ${err}`
    })
    next(err);
  }
}
/* Actualizar las opciones de las preguntas de opcion multiple */
export const updateSubQuestionOption = async (req: Request, res: Response, next: NextFunction) => {
  try {
    /* id survey */
    let { id } = req.params;
    /* id question */
    let { idQuestion } = req.params; 
    let questionById = await Survey.findById(id);
    /** Obtengo todo el array de preguntas */
    let questionEmbedded = questionById?.question;
    const verifyQuestionUndefined:string[] | undefined = questionEmbedded?.map((elem)=>{
      return elem._id;
    });
    const surveyId: surveyById | null =  await Survey.findById(id);
    let surveyQuestion = surveyId?.question.find(elem => elem._id == idQuestion);
    
    if(!surveyQuestion){
      return res.status(404).json({
        message: `Dont exist question with this ID ${ idQuestion }`
      })
    }
    /* Obtengo el typeQuestion  */
    let typeQuestion:string | undefined = surveyQuestion?.typeQuestion; 

    if(typeQuestion === 'QUESTION_MULTIPLE'){
      type optionsAnswer = {
        options:string[] 
      }

      let { options }:optionsAnswer = req.body;

      let optQuestionUpdated:any;
      if(verifyQuestionUndefined!== undefined){
         optQuestionUpdated = await Survey.updateOne(
          {"_id": id},{$set: {"question.$[answ].answerM.options": options}},{arrayFilters:[{"answ._id": idQuestion}]})
      }
      res.status(200).json({
        message: 'OptionQuestion updated',
        optQuestionUpdated
      })
    }
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
      message: 'Survey deleted'
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

    let questionById : surveyById | null= await Survey.findById(idSurvey); 
    // OBTENGO UN ARREGLO CON LA PREGUNTA A ELIMINAR...
    let arrayQuestion: returnQuestion | undefined = questionById?.question;
    let questionD:question | undefined = arrayQuestion?.find(element => element._id == idQuestion);
    let deleteEl = questionD?._id;
    /*  */
    if(!questionD){
      return res.status(404).json({
        message: `Dont exist question with this ID ${ idQuestion }`
      })
    }
    /*  */
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
