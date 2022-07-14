/* import { Request,Response,NextFunction } from "express";
import Question from "../models/question";

export const pushQuest= async(req:Request,res:Response,next:NextFunction) => {
  try {
    let body = req.body;
    let { idQ } = req.params;
    let quest:any = await Question.findById(idQ);
    let data = {
      'titleQuestion': body.titleQuestion,
      'typeQuestion': body.typeQuestion,
    }
   
  quest.question.push(data);
  quest.save();
  return res.status(200).json(quest);
    
  } catch (error) {
    res.status(500).json({
        message: ` An error ocurred ${error}`
    })
    next(error);
  }
} */