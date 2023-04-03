import Survey from '../models/survey'

export const titleSurveyUn = async(titleSurvey:string) => {
  const titleS:any =  await Survey.findOne({ titleSurvey });
  if(titleS){
  	throw new Error(`${ titleS.titleSurvey } is already in use`)
  }
}

