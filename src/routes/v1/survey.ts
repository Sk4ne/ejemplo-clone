import { Router,Request,Response, NextFunction } from 'express'
import {validateJwt } from '../../middlewares/validateJwt'
import { check } from 'express-validator'


import {
    addSurvey,
    deleteSurvey,
    getSurvey,
    getSurveys,
    getSurveyQuestion,
    updateSurvey,
    updateSubQuestion,
    pushQuestion,
    deleteAllSurvey,
    updateSubQuestionOption,
} from '../../controllers/surveyController'
import { validateFields } from '../../middlewares/validateFields';
import { titleSurveyUn } from '../../helpers/fieldQuestUnique';
import { deleteQuestion } from '../../controllers/surveyController';

const router: Router = Router();

router.get('/surveys',getSurveys);
router.get('/survey/:id', getSurvey);

// router.get('/survey/:idSurvey/:idQuestion',getSurveyQuestion)
router.get('/survey/:idSurvey/:idQuestion',getSurveyQuestion)

// Delete question
router.delete('/survey/:idSurvey/:idQuestion',deleteQuestion)

/* check() is a middleware used to validate the incoming data as per the fields */
router.post('/survey',[
  /* Verify that titleSurvey is unique */
  check('titleSurvey').custom(titleSurveyUn),
  check('titleSurvey','titleSurvey is required')
    .not().isEmpty(),
  check('description','description is required')
    .not().isEmpty(),
  check('question.*.titleQuestion','titleQuestion is required')
    .not().isEmpty(),
  check('question.*.typeQuestion','typeQuestion is required')
    .not().isEmpty()
],validateFields,addSurvey);

router
  .put('/survey/:id', updateSurvey)
  /* .put('/sub-question/:id',updateSubQuestion) */
  /* Responder una pregunta  */
  .put('/sub-question/:id/:idQuestion',updateSubQuestion)
  /* Actualizar las opciones de una pregunta de opcion multiple */
  .put('/question/option/:id/:idQuestion',updateSubQuestionOption)
  .delete('/survey/:id', deleteSurvey)
  .put('/push-question/:idElement',pushQuestion)
  .delete('/survey',deleteAllSurvey);

export default router;



