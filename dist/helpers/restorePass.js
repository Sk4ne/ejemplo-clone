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
/* NEW 16 ABRIL 2023 */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const restorePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield models_1.User.findOne({ email: req.body.email });
        let payload = { id: user === null || user === void 0 ? void 0 : user._id };
        /* PASAR UN TOKEN RANDON POR RAZONES DE SEGURIDAD */
        let token = jsonwebtoken_1.default.sign({ data: 'lycaon' }, process.env.SECRET_OR_PRIVATE_KEY, { expiresIn: '10M' });
        let decode = yield jsonwebtoken_1.default.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        if (!(user === null || user === void 0 ? void 0 : user.email) || (user === null || user === void 0 ? void 0 : user.email) == '') {
            return res.status(404).send("Don't exist and user with this email in the database");
        }
        let link = `${process.env.BASE_URL}/password-reset/${user._id}/${token}`;
        user.securityToken = yield token;
        /* Save securityToken in database */
        let sav = yield user.save();
        // console.log(token) 
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
        <h3>
          Haz solicitado restablecer la contraseña de cuenta en la pagina survey S.A.S \n para cambiarla por favor pulsa el boton
        </h3>
        <br><br><br>
        <a href="${link}" style='background-color:blue; color:white; padding:20px;text-decoration:none; border-radius:50px;font-size:18px'>Cambiar Contrasena</a>
        <br><br>
      
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
        res.status(401).json({
            msg: 'ALGUN ERROR OCURRIO!!!'
        });
        next(err);
    }
});
exports.restorePassword = restorePassword;
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const user: UserReturnDb | null = await User.findById(req.params.idUser);
        const user = yield models_1.User.findById(req.params.idUser);
        /* VERIFICAR SI EL TOKEN ES VALIDO O EXPIRO */
        const unixTimestamp = 1620000000;
        const dateNow = Date.now() / 1000;
        console.log(`date now: ${dateNow}`);
        let decoded = jsonwebtoken_1.default.verify(user.securityToken, process.env.SECRET_OR_PRIVATE_KEY);
        console.log(`TOKEN EXPIRES: ${decoded.exp}`);
        // if (!(user && decoded.exp <= moment.unix(unixTimestamp))) {
        if (!user || decoded.exp < Date.now() / 1000) {
            return res.status(401).json('Invalid link or token expired');
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
        res.status(401).json({
            msg: 'El link para reestablecer la contrasena expiro recuerde que solo tiene 5 minutos para realizar este proceso.!!!'
        });
        next(err);
    }
});
exports.changePassword = changePassword;
