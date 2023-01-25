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
const passport_1 = __importDefault(require("passport"));
const FacebookStrategy = require('passport-facebook').Strategy;
const generateJwt_1 = require("../helpers/generateJwt");
const models_1 = require("../models");
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
/** Sign-up facebook */
passport_1.default.use("sign-up-facebook", new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.CALLBACK_URL_LOCAL_FACEBOOK,
    profileFields: ['id', 'email', 'first_name', 'last_name']
}, (_accesToken, _refreshToken, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, first_name } = profile._json;
    const user = yield models_1.User.findOne({ email });
    if (user && (user === null || user === void 0 ? void 0 : user.facebook) === true) {
        const token = yield (0, generateJwt_1.generateJWT)(user.id);
        const userData = {
            user,
            token
        };
        return cb(null, userData);
    }
    else {
        let dataUser = {
            name: first_name,
            email,
            password: ':)',
            facebook: true
        };
        let newUser = yield models_1.User.create(dataUser);
        let ID_USER = newUser._id;
        /**generate token user */
        const token = yield (0, generateJwt_1.generateJWT)(ID_USER);
        let userDB = {
            newUser,
            token
        };
        return cb(null, userDB);
    }
})));
