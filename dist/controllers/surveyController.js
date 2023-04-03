"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.deleteAllSurvey = exports.deleteSurvey = exports.updateSubQuestionOption = exports.updateSubQuestion = exports.updateSurvey = exports.pushQuestion = exports.getSurveyQuestion = exports.getSurvey = exports.getSurveys = exports.addSurvey = void 0;
/*==================================
*           Imports
 I. export const addQuestion = async(req,res,next)=>{..code}
 II. exports.addQuestion = async(req,res,next)=>{..code}
 III. module.exports = {..code}
 IV. export default {..code}
==================================*/
const survey_1 = __importDefault(require("../models/survey"));
const addSurvey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const survey = yield survey_1.default.create(body);
        res.status(201).json(survey);
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.addSurvey = addSurvey;
const getSurveys = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const surveys = yield survey_1.default.find({});
        res.status(200).json(surveys);
    }
    catch (err) {
        res.status(500).json({
            message: ` An error ocurred ${err}`
        });
        next(err);
    }
});
exports.getSurveys = getSurveys;
const getSurvey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        const survey = yield survey_1.default.findById(id);
        res.status(200).json(survey);
    }
    catch (err) {
        res.status(500).json({
            message: ` An error ocurred ${err}`
        });
        next(err);
    }
});
exports.getSurvey = getSurvey;
//* Obtener un survey con una pregunta en especifico
const getSurveyQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { idSurvey } = req.params;
        let { idQuestion } = req.params;
        //* Convertir un id de mongodb a string. idMongo.toString()
        const surveyId = yield survey_1.default.findById(idSurvey);
        let surveyQuestion = surveyId === null || surveyId === void 0 ? void 0 : surveyId.question.find(elem => elem._id == idQuestion);
        if (!surveyQuestion) {
            return res.status(404).json({
                message: `Dont exist question with this ID ${idQuestion}`
            });
        }
        return res.status(200).json({
            surveyQuestion
        });
    }
    catch (err) {
        res.status(500).json({
            message: ` An error ocurred ${err}`
        });
        next(err);
    }
});
exports.getSurveyQuestion = getSurveyQuestion;
/**
 * * Agregar una nueva pregunta al array de objetos questions
 *
*/
const pushQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* PREGUNTAS ABIERTAS  */
        let idElement = req.params.idSurvey;
        // let { titleQuestion, typeQuestion, answerO}:answerQuestionOpen = req.body;
        let preg /* questionReturn */ = req.body.question;
        // return console.log(preg);
        let tipoPregunta = preg[0]['typeQuestion'];
        let opciones = preg[0]['answerM']['options'];
        let respMultiple = preg[0]['answerM']['answer'];
        let respOpen = preg[0]['answerO'];
        let tituloPregunta = preg[0]['titleQuestion'];
        if (!(tipoPregunta === 'QUESTION_OPEN' || tipoPregunta === 'QUESTION_MULTIPLE')) {
            return res.status(404).json({ msg: `${tipoPregunta} is not valid ddsdfdf :)` });
        }
        if (tipoPregunta === 'QUESTION_OPEN') {
            yield survey_1.default.updateOne({ _id: idElement }, {
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
            let questionPush = yield survey_1.default.findById(idElement);
            return res.status(200).json(questionPush);
        }
        if (tipoPregunta === 'QUESTION_MULTIPLE') {
            /* PREGUNTAS DE SELECCION MULTIPLE  */
            yield survey_1.default.updateOne({ _id: idElement }, {
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
            let questionPush = yield survey_1.default.findById(idElement);
            return res.status(200).json(questionPush);
        }
    }
    catch (err) {
        res.status(500).json({
            err
            // message: ` An error ocurred ${err}`
        });
        next(err);
    }
});
exports.pushQuestion = pushQuestion;
const updateSurvey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let update = req.body;
        let surveyUpdate = yield survey_1.default.findByIdAndUpdate(id, update, { new: true });
        res.status(200).json({
            msg: 'Survey update',
            surveyUpdate
        });
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.updateSurvey = updateSurvey;
/**
 * Responder una pregunta en el array de objetos questions
 */
const updateSubQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* id survey */
        let { id } = req.params;
        /* id question */
        let { idQuestion } = req.params;
        let questionById = yield survey_1.default.findById(id);
        /** Obtengo todo el array de preguntas */
        let questionEmbedded = questionById === null || questionById === void 0 ? void 0 : questionById.question;
        const verifyQuestionUndefined = questionEmbedded === null || questionEmbedded === void 0 ? void 0 : questionEmbedded.map((elem) => {
            return elem._id;
        });
        const surveyId = yield survey_1.default.findById(id);
        let surveyQuestion = surveyId === null || surveyId === void 0 ? void 0 : surveyId.question.find(elem => elem._id == idQuestion);
        if (!surveyQuestion) {
            return res.status(404).json({
                message: `Dont exist question with this ID ${idQuestion}`
            });
        }
        /* Obtengo el typeQuestion  */
        let typeQuestion = surveyQuestion === null || surveyQuestion === void 0 ? void 0 : surveyQuestion.typeQuestion;
        if (typeQuestion === 'QUESTION_MULTIPLE') {
            let { answerMultiple } = req.body;
            let subQuestionUpdated;
            if (verifyQuestionUndefined !== undefined) {
                subQuestionUpdated = yield survey_1.default.updateOne({ "_id": id }, { $set: { "question.$[answ].answerM.answer": answerMultiple } }, { arrayFilters: [{ "answ._id": idQuestion }] });
            }
            // ! ESTE BLOQUE DE CODIGO Y EL QUE ESTA EN LA OPCION_ABIERTA SE ESTA REPITIENDO - OJO -Refactorizarlo mas adelante
            /* CREAR UN SERVICIO QUE ME PERMITA ACTUALIZAR EL TITULO DE LA PREGUNTA - NEW ADD 3 ABRIL - 2023 */
            let { titleQuestion } = req.body;
            let questionUpdate;
            if (verifyQuestionUndefined !== undefined) {
                questionUpdate = yield survey_1.default.updateOne({ _id: id, 'question._id': idQuestion }, { $set: { 'question.$.titleQuestion': titleQuestion } });
                // console.log(questionUpdate)
            }
            /* </CREAR UN SERVICIO QUE ME PERMITA ACTUALIZAR EL TITULO DE LA PREGUNTA - NEW ADD 3 ABRIL - 2023 */
            res.status(200).json({
                message: 'Question updated',
                subQuestionUpdated,
                /* new 3 abril 2023*/
                questionUpdate
            });
        }
        if (typeQuestion === 'QUESTION_OPEN') {
            let { answerOpen } = req.body;
            let subQuestionUpdated;
            if (verifyQuestionUndefined !== undefined) {
                subQuestionUpdated = yield survey_1.default.updateOne({ _id: id, 'question._id': idQuestion }, { $set: { 'question.$.answerO': answerOpen } });
            }
            /* CREAR UN SERVICIO QUE ME PERMITA ACTUALIZAR EL TITULO DE LA PREGUNTA - NEW ADD 3 ABRIL - 2023 */
            let { titleQuestion } = req.body;
            let questionUpdate;
            if (verifyQuestionUndefined !== undefined) {
                questionUpdate = yield survey_1.default.updateOne({ _id: id, 'question._id': idQuestion }, { $set: { 'question.$.titleQuestion': titleQuestion } });
                // console.log(questionUpdate)
            }
            // console.log(titleQuestion);
            /* </CREAR UN SERVICIO QUE ME PERMITA ACTUALIZAR EL TITULO DE LA PREGUNTA - NEW ADD 3 ABRIL - 2023 */
            res.status(200).json({
                message: 'Question updated',
                subQuestionUpdated,
                /* new 3 abril 2023*/
                questionUpdate
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.updateSubQuestion = updateSubQuestion;
/* Actualizar las opciones de las preguntas de opcion multiple */
const updateSubQuestionOption = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* id survey */
        let { id } = req.params;
        /* id question */
        let { idQuestion } = req.params;
        let questionById = yield survey_1.default.findById(id);
        /** Obtengo todo el array de preguntas */
        let questionEmbedded = questionById === null || questionById === void 0 ? void 0 : questionById.question;
        const verifyQuestionUndefined = questionEmbedded === null || questionEmbedded === void 0 ? void 0 : questionEmbedded.map((elem) => {
            return elem._id;
        });
        const surveyId = yield survey_1.default.findById(id);
        let surveyQuestion = surveyId === null || surveyId === void 0 ? void 0 : surveyId.question.find(elem => elem._id == idQuestion);
        if (!surveyQuestion) {
            return res.status(404).json({
                message: `Dont exist question with this ID ${idQuestion}`
            });
        }
        /* Obtengo el typeQuestion  */
        let typeQuestion = surveyQuestion === null || surveyQuestion === void 0 ? void 0 : surveyQuestion.typeQuestion;
        if (typeQuestion === 'QUESTION_MULTIPLE') {
            let { options } = req.body;
            let optQuestionUpdated;
            if (verifyQuestionUndefined !== undefined) {
                optQuestionUpdated = yield survey_1.default.updateOne({ "_id": id }, { $set: { "question.$[answ].answerM.options": options } }, { arrayFilters: [{ "answ._id": idQuestion }] });
            }
            res.status(200).json({
                message: 'OptionQuestion updated',
                optQuestionUpdated
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.updateSubQuestionOption = updateSubQuestionOption;
const deleteSurvey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        yield survey_1.default.findByIdAndDelete({ _id: id });
        res.status(200).json({
            message: 'Survey deleted'
        });
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.deleteSurvey = deleteSurvey;
/**
 * Delete all documents of collection question
 */
const deleteAllSurvey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield survey_1.default.deleteMany({});
        res.status(200).json({ msg: 'All documents was deleted' });
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.deleteAllSurvey = deleteAllSurvey;
/**
 * Delete one question
 */
const deleteQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { idSurvey } = req.params;
        let { idQuestion } = req.params;
        let questionById = yield survey_1.default.findById(idSurvey);
        // OBTENGO UN ARREGLO CON LA PREGUNTA A ELIMINAR...
        let arrayQuestion = questionById === null || questionById === void 0 ? void 0 : questionById.question;
        let questionD = arrayQuestion === null || arrayQuestion === void 0 ? void 0 : arrayQuestion.find(element => element._id == idQuestion);
        let deleteEl = questionD === null || questionD === void 0 ? void 0 : questionD._id;
        /*  */
        if (!questionD) {
            return res.status(404).json({
                message: `Dont exist question with this ID ${idQuestion}`
            });
        }
        /*  */
        const questionDelete = yield survey_1.default.updateOne({ _id: idSurvey }, { $pull: { question: { _id: deleteEl } } });
        return res.status(200).json({
            questionDelete
        });
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
    }
});
exports.deleteQuestion = deleteQuestion;
