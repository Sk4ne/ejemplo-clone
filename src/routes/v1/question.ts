import { Router,Request,Response, NextFunction } from 'express'
import {validateJwt } from '../../middlewares/validateJwt'
import { check } from 'express-validator'


import {
    addQuestion,
    deleteQuestion,
    getQuestion,
    getQuestions,
    updateQuestion,
    updateSubQuestion,
    pushQuestion,
    deleteAllQuestion,
} from '../../controllers/questionController'
import { validateFields } from '../../middlewares/validateFields';
import { titleSurveyUn } from '../../helpers/fieldQuestUnique';

const router: Router = Router();

router.get('/questions',getQuestions);
router.get('/question/:id', getQuestion);

/* check() is a middleware used to validate the incoming data as per the fields */
router.post('/question',[
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
],validateFields,addQuestion);

router
  .put('/question/:id', updateQuestion)
  /* .put('/sub-question/:id',updateSubQuestion) */
  .put('/sub-question/:id/:idQuestion',updateSubQuestion)
  .delete('/question/:id', deleteQuestion)
  .put('/push-question/:idElement',pushQuestion)
  .delete('/question',deleteAllQuestion);

export default router;



