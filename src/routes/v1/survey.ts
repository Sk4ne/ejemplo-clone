import { Router,Request,Response, NextFunction } from 'express'
import {validateJwt } from '../../middlewares/validateJwt'
import { check } from 'express-validator'


import {
    addSurvey,
    deleteSurvey,
    getSurvey,
    getSurveys,
    updateSurvey,
    updateSubQuestion,
    pushQuestion,
    deleteAllSurvey,
} from '../../controllers/surveyController'
import { validateFields } from '../../middlewares/validateFields';
import { titleSurveyUn } from '../../helpers/fieldQuestUnique';

const router: Router = Router();

router.get('/surveys',getSurveys);
router.get('/survey/:id', getSurvey);

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
  .put('/sub-question/:id/:idQuestion',updateSubQuestion)
  .delete('/survey/:id', deleteSurvey)
  .put('/push-question/:idElement',pushQuestion)
  .delete('/survey',deleteAllSurvey);

export default router;



