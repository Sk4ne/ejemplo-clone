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
exports.validateJwt = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const validateJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /** Read token in the headers */
    const token = req.header('x-token');
    if (!token) {
        /** 401 no authorization */
        return res.status(401).json({
            msg: 'No token in the request'
        });
    }
    try {
        /** Verify if token is valid */
        let privateKey = process.env.SECRET_OR_PRIVATE_KEY;
        const dataReturn = jsonwebtoken_1.default.verify(token, privateKey);
        /** id dataReturn */
        const { id } = dataReturn;
        /** Read the user that corresponds to the id */
        const user = yield user_1.default.findById(id);
        if (!user) {
            return res.status(401).json({
                msg: 'There are not users in DB / token no valid'
            });
        }
        /** Verify is id have state true */
        if (!user.state) {
            return res.status(401).json({
                msg: 'Token no valid - user with state:false'
            });
        }
        /* Store the user in the request, so we can use it later to validate the roles.  */
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({
            msg: 'Token no valid'
        });
    }
});
exports.validateJwt = validateJwt;
