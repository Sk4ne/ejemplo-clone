import Question from '../models/question'

export const titleSurveyUn = async(titleSurvey:string) => {
  const titleS:any =  await Question.findOne({ titleSurvey });
  if(titleS){
  	throw new Error(`${ titleS.titleSurvey } is already in use`)
  }
}