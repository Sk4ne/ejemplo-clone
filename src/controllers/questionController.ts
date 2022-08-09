/*================================== 
*           Imports
 I. export const addQuestion = async(req,res,next)=>{..code}
 II. exports.addQuestion = async(req,res,next)=>{..code}
 III. module.exports = {..code}
 IV. export default {..code}
==================================*/
import Question from '../models/question'
import { Request, Response, NextFunction } from 'express'

/* const removeSubQuestion = async() => {
  let elemDelete:any = await Question.updateOne(
    {_id:'62d5c94ea047965d0f187643','question._id':'62d5c94ea047965d0f187644'},
    {
      $unset:{
        'question.$._id':'',
        'question.$.titleQuestion':'',
        'question.$.typeQuestion':'',
        'question.$.answer':''
      }
    }
  );
  console.log(elemDelete);
}

removeSubQuestion() */
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

    if( !(typeQuestion === 'QUESTION_OPEN' || typeQuestion === 'MULTIPLE' ) ){
      return res.status(404).json({msg:`${typeQuestion} is not typeQuestion valid :)`});
    }
    /* Push to array-objet survey */
    await Question.updateOne(
      {_id:idElement },
      {
        $push: {
          'question': {
            'titleQuestion': titleQuestion,
            'typeQuestion': typeQuestion,
            'answer': answer
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
    await Question.findByIdAndUpdate(id, update, { new: true })
    res.status(200).json({ message: 'Question update' });
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
    let update = req.body;
    const subId = '629515ac9d83d27030bc2230';
    let { titleQ } = req.query;
    await Question.findByIdAndUpdate(
      {
        "_id": id,
        update
      },
      {
        $set: {
          "question.$[elemX].titleQuestion": titleQ
        }
      },
      {
        "arrayFilters": [
          {
            "elemX._id": subId
          }
        ]
      }
    )
    // return question update
    const questionUp = await Question.findById(id);

    res.status(200).json({
      message: 'Question updated',
      questionUp
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

