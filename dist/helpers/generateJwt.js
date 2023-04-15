"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// export const generateJWT = (id:string | Types.ObjectId= '') => {
const generateJWT = (id = '', name, email) => {
    return new Promise((resolve, reject) => {
        //  const payload = { id };
        const payload = { id, name, email };
        jsonwebtoken_1.default.sign(payload, process.env.SECRET_OR_PRIVATE_KEY, {
            expiresIn: '10d'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generateJWT = generateJWT;
