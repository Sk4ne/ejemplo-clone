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
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const models_1 = require("../models");
const generateJwt_1 = require("../helpers/generateJwt");
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
passport_1.default.use('sign-up-google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL_LOCAL_GOOGLE,
    passReqToCallback: true,
    /* new */
    scope: ['profile', 'email']
}, (_req, _accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const { given_name, email } = profile._json;
    let user = yield models_1.User.findOne({ email });
    if (user && (user === null || user === void 0 ? void 0 : user.google) === true) {
        const token = yield (0, generateJwt_1.generateJWT)(user.id);
        const userData = {
            user,
            token
        };
        return done(null, userData);
    }
    else {
        let dataUser = {
            name: given_name,
            email,
            password: ':)',
            google: true,
        };
        let newUser = yield models_1.User.create(dataUser);
        let ID_USER = newUser._id;
        /**generate token user */
        const token = yield (0, generateJwt_1.generateJWT)(ID_USER);
        let userDB = {
            newUser,
            token
        };
        return done(null, userDB);
    }
})));
