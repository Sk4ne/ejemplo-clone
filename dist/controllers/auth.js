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
exports.login = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateJwt_1 = require("../helpers/generateJwt");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** Exist email */
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'Email or Password are incorrect'
            });
        }
        /** Verify state user */
        if (!user.state) {
            return res.status(400).json({
                msg: ' User desactivate'
            });
        }
        /** Verify that passwords match  */
        const validPass = bcryptjs_1.default.compareSync(password, user.password);
        if (!validPass) {
            return res.status(400).json({
                msg: 'Password incorrect'
            });
        }
        /** Generar JWT */
        const token = yield (0, generateJwt_1.generateJWT)(user.id);
        res.json({
            user,
            token
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Speak with the admin'
        });
    }
});
exports.login = login;
