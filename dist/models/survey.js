"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
/* enum */
const validTypeQuestion = {
    values: ['QUESTION_OPEN', 'QUESTION_MULTIPLE'],
    message: '{ VALUE } is not a type question valid'
};
const surveySchema = new mongoose_1.Schema({
    titleSurvey: { type: String },
    description: { type: String },
    question: [{
            titleQuestion: {
                type: String
            },
            typeQuestion: {
                type: String,
                enum: validTypeQuestion,
            },
            answerO: { type: String, default: '' },
            answerM: {
                options: { type: [String], default: '' },
                answer: { type: String, default: '' }
            }
        }],
    /* DATE FORMAT */
    // createAt:{ type:String,default: new Date().toLocaleString('es-CO')},
    createAt: { type: Date, default: Date.now() },
    state: { type: Boolean, default: true }
}, { versionKey: false });
/* Apply the uniqueValidator plugin to nameSchema */
surveySchema.plugin(mongoose_unique_validator_1.default);
const Survey = mongoose_1.default.model('Question', surveySchema);
/* Apply the uniqueValidator plugin to surveySchema
surveySchema.plugin(uniqueValidator, {message: 'Error, expected {PATH} to be unique'});
*/
exports.default = Survey;
