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
exports.changePassword = exports.restorePassword = void 0;
const models_1 = require("../models");
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const restorePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield models_1.User.findOne({ email: req.body.email });
        /* console.log('USER',user)
        console.log('UserEmail',user?.email) */
        if (!(user === null || user === void 0 ? void 0 : user.email) || (user === null || user === void 0 ? void 0 : user.email) == '') {
            return res.status(404).send("Don't exist and user with this email in the database");
        }
        let link = `${process.env.BASE_URL}/password-reset/${user._id}`;
        let transporter = nodemailer_1.default.createTransport({
            host: process.env.BASE_URL,
            port: 587,
            secure: true,
            service: process.env.SERVICE,
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.PASS
            }
        });
        let mailOptions = {
            from: `"Survey S.A.S 👻" <${process.env.EMAIL_FROM}>`,
            to: user.email,
            subject: 'Survey S.A.S',
            text: "Hello world?",
            html: //html
            `
        <p>
          Haz solicitado restablecer la contraseña de cuenta en la pagina survey S.A.S \n para hacer por favor pulsa el siguiente botón
        </p>
        <br><br><br>
        <a href="${link}" style='background-color:blue;color:white;padding:20px;font-size:18px'>Change Password</a>
      
      `
        };
        yield transporter.sendMail(mailOptions, (err, info) => {
            err ? console.log(err)
                : res.status(200).json({
                    msg: 'Email send successfully',
                    info: `${info.response}`
                });
        });
    }
    catch (err) {
        next(err);
    }
});
exports.restorePassword = restorePassword;
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const user: UserReturnDb | null = await User.findById(req.params.idUser);
        const user = yield models_1.User.findById(req.params.idUser);
        if (!user) {
            return res.status(404).send('Invalid link or expired');
        }
        /** La contraseña que encuentra en el objeto user hay que reeemplazarla por la nueva contraseña
         * que el usuario ingresa en el body.
        */
        user.password = req.body.password;
        user.password = yield bcryptjs_1.default.hashSync(user.password, 10);
        yield user.save();
        res.status(200).json({
            msg: 'Password update successfully'
        });
    }
    catch (err) {
        next(err);
    }
});
exports.changePassword = changePassword;
