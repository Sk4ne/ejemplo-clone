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
exports.changePasswordUser = void 0;
const models_1 = require("../models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const changePasswordUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;
        const user = yield models_1.User.findById(id);
        if (!user) {
            res.status(404).json({ msg: 'El usuario no existe' });
        }
        const isMatchPassword = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatchPassword) {
            res.status(404).json({ msg: 'Las contrasenas no coinciden' });
        }
        else {
            // ACTUALIZAR LA CONTRASENA
            const hash = yield bcryptjs_1.default.hash(newPassword, 10);
            user.password = hash;
            yield user.save();
            res.status(200).json({
                msg: 'Contrasena Actualizada!',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: ` An error ocurred ${error}`
        });
        // next(error)
    }
});
exports.changePasswordUser = changePasswordUser;
