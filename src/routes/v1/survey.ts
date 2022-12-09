import { Router,Request,Response, NextFunction } from 'express'
import {validateJwt } from '../../middlewares/validateJwt'
import { check } from 'express-validator'
/* check() is a middleware used to validate the incoming data as per the fields */

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

/**
 * @swagger
 * components:
 *  schemas:
 *    Survey:
 *      type: object
 *      properties: 
 *        id:
 *          type: string
 *          description: id del survey autogenerado
 *        titleSurvey:
 *          type: string
 *          description: titulo del survey
 *        description:
 *          type: string
 *          description: descripcion del survey
 *        question:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              titleQuestion:
 *                type: string
 *                description: Titulo de la pregunta
 *              typeQuestion: 
 *                type: string
 *                description: Tipo de pregunta QUESTION_OPEN o QUESTION_MULTIPLE
 *              answerO:
 *                type: string
 *                description: Respuesta pregunta abierta (QUESTION_OPEN)
 *              answerM:
 *                type: object
 *                properties:
 *                  options:
 *                    type: array
 *                    opt1: string
 *                  answer:
 *                    type: string
 *                    description: Respuesta pregunta opcion multiple (QUESTION_MULTIPLE)
 *        createAt:
 *          type: string
 *          description: Fecha de creacion de la encuesta
 *        state:
 *          type: boolean
 *          description: Si esta es true la encuesta esta activa
 *      required:
 *        - titleSurvey
 *        - description 
 *      example:
 *        id: 639254d35f2830c32ee8cb32
 *        titleSurvey: Stack de tecnologias mas usadas en 2022
 *        description: El objetivo de esta encuesta es conocer la opinion de los devs
 *    SurveyNotFound:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: a messsage for the not found task
 *      example:
 *       message: Survey was not found      
 *  parameters:
 *    surveyId:
 *      in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: Id del survey
 */

/**
 * @swagger 
 * tags:
 *  name: Tasks
 *  description: Task endpoint
 */

/**
 * @swagger
 * /surveys:
 *  get:
 *    summary: Retorna todas las encuestas
 *    tags: [Tasks]
 *    responses:
 *      200:
 *        description: Listado de encuestas
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Survey'
 *                
 */
router.get('/surveys',getSurveys);
/**
 * 
 * @swagger
 * /survey/{id}:
 *  get:
 *    summary: Obtener un survey por ID
 *    tags: [Tasks]
 *    parameters:
 *      - $ref: '#/components/parameters/surveyId'
 *    responses: 
 *      200:
 *        description: Survey fue encontrado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Survey' 
 *      500:
 *        description: Error en el servidor 
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SurveyNotFound'
 */
router.get('/survey/:id', getSurvey);
router.get('/survey/:idSurvey/:idQuestion',getSurveyQuestion)
router.delete('/survey/:idSurvey/:idQuestion',deleteQuestion)

/**
 * @swagger
 * /survey:
 *  post:
 *    summary: Crear un nuevo survey
 *    tags: [Tasks]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Survey'
 *    responses:
 *      201:
 *        description: Se creo el survey exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Survey'
 *      500:
 *        description: Error en el servidor
 */
router.post('/survey',[
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

/**
 * @swagger
 * /survey/{id}:
 *  put:
 *    summary: Actualizar un survey
 *    tags: [Tasks]
 *    parameters: 
 *      - $ref: '#/components/parameters/surveyId'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Survey'
 *    responses:
 *      200:
 *        description: Survey update
 *        content:
 *          application/json:
 *            schema: 
 *              $ref: '#/components/schemas/Survey'
 *      500:
 *        description: Error en el servidor
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SurveyNotFound'
 */
router.put('/survey/:id', updateSurvey);
router.put('/sub-question/:id/:idQuestion',updateSubQuestion);
router.put('/question/option/:id/:idQuestion',updateSubQuestionOption);
/**
 * @swagger
 * /survey/{id}:
 *  delete:
 *    summary: Eliminar survey por ID
 *    tags: [Tasks]
 *    parameters:
 *      - $ref: '#/components/parameters/surveyId'
 *    responses: 
 *      200:
 *        description: Survey fue eliminado exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Survey'
 *      500:  
 *        description: Error en el servidor
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SurveyNotFound'
 * 
 */
router.delete('/survey/:id', deleteSurvey);
router.put('/push-question/:idElement',pushQuestion);
router.delete('/survey',deleteAllSurvey);

export default router;



