import { Router } from 'express'
import {validateJwt } from '../middlewares/validateJwt'

import {
    addQuestion,
    deleteQuestion,
    getQuestion,
    getQuestions,
    updateQuestion,
    updateSubQuestion,
    /** test */
    pushQuestion,
    deleteAllQuestion,
} from '../controllers/questionController'

const router: Router = Router();

// Routes
// router.get('/questions',validateJwt,getQuestions);
router.get('/questions',getQuestions);
router.get('/question/:id', getQuestion);
router.post('/question', addQuestion);
router.put('/question/:id', updateQuestion);
router.put('/quest/:id',updateSubQuestion);
router.delete('/question/:id', deleteQuestion);
/** test */
router.put('/push-question/:idElement',pushQuestion)
/** delete all questions */
router.delete('/question',deleteAllQuestion)

export default router;



