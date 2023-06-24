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
exports.logoutGoogle = exports.googleFailure = exports.googleSuccess = exports.logoutFacebook = exports.facebookSuccess = exports.noAuth = exports.updateDoc = exports.deleteAllUsers = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.addUser = void 0;
require("../upload/cloudinary");
const models_1 = require("../models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_1 = require("cloudinary");
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let body = req.body;
        body.password = yield bcryptjs_1.default.hashSync(body.password, 10);
        let pathImage;
        pathImage = yield ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
        /* If user don't choose an image. Add user with image by default */
        if (!pathImage) {
            const user = yield models_1.User.create(body);
            res.status(201).json({ user });
        }
        else {
            const { secure_url } = yield cloudinary_1.v2.uploader.upload(pathImage, { folder: 'api-survey/' });
            body.img = secure_url;
            const user = yield models_1.User.create(body);
            res.status(201).json({ user });
        }
    }
    catch (err) {
        res.status(500).send({
            // msg:`An ocurred error  ${err}`
            msg: err
        });
        next(err);
    }
});
exports.addUser = addUser;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield models_1.User.find({});
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({
            message: ` An error ocurred ${err}`
        });
        next(err);
    }
});
exports.getUsers = getUsers;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        const userID = yield models_1.User.findById(id);
        if (!userID) {
            res.status(404).json({
                msg: `Dont exist user with this ID ${id}`
            });
        }
        return res.status(200).json({
            userID
        });
    }
    catch (err) {
        res.status(500).json({
            message: ` An error ocurred ${err}`
        });
        next(err);
    }
});
exports.getUser = getUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    /**
     * If I don't send the image when updating a user.
     * Multer gives me an error saying that it did not find the file parameter.
    */
    try {
        let { id } = req.params;
        let update = req.body;
        let pathImage = yield ((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
        /* Validar contraseña contra DB */
        const salt = bcryptjs_1.default.genSaltSync(10);
        if (req.body.password) {
            req.body.password = bcryptjs_1.default.hashSync(req.body.password, salt);
        }
        if (!req.file) {
            // let userToUpdate = await User.findById(id);
            let updateUser = yield models_1.User.findByIdAndUpdate(id, update, { new: true });
            res.status(200).json({
                msg: 'User updated...',
                updateUser
            });
        }
        else {
            /* We delete the existing image in cloudinary and replace it with a new one. */
            let imgUser = yield models_1.User.findById(id);
            const nameArr = imgUser === null || imgUser === void 0 ? void 0 : imgUser.img.split('/');
            if (nameArr != undefined) {
                const name = nameArr[nameArr.length - 1];
                const [public_id] = name.split('.');
                yield cloudinary_1.v2.uploader.destroy(`api-survey/${public_id}`);
            }
            const { secure_url } = yield cloudinary_1.v2.uploader.upload(pathImage, { folder: 'api-survey/' });
            let data = Object.assign({ img: secure_url }, update);
            let updateUser = yield models_1.User.findByIdAndUpdate(id, data, { new: true });
            res.status(200).json({
                msg: 'User updated...',
                updateUser
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'An error ocurred',
            err
        });
        next(err);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        /** Change state true to false
        * await User.findByIdAndUpdate(id,{state:false},{new:true});
        */
        const imgU = yield models_1.User.findById(id);
        if (imgU === null || imgU === void 0 ? void 0 : imgU.img) {
            const nameArr = imgU === null || imgU === void 0 ? void 0 : imgU.img.split('/');
            const name = nameArr[nameArr.length - 1];
            const [public_id] = name.split('.');
            yield cloudinary_1.v2.uploader.destroy(`api-survey/${public_id}`);
        }
        yield models_1.User.findByIdAndDelete(id);
        res.status(200).json({
            message: 'User delete successfully',
        });
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.deleteUser = deleteUser;
const deleteAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.User.deleteMany({});
        res.status(200).json({
            msg: 'All user was deleted successfully'
        });
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.deleteAllUsers = deleteAllUsers;
/* This function is for test. Update role of all document of collection user */
const updateDoc = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* update all role user */
        yield models_1.User.updateMany({}, { $set: { role: 'ADMIN_ROLE' } });
        res.status(200).json({ msg: 'All documents was updated' });
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.updateDoc = updateDoc;
/* Function to controle user no auth */
const noAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            msg: 'No estas logueado, hazlo...'
        });
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.noAuth = noAuth;
const facebookSuccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({
            msg: 'Login ok facebook',
            user: req.user
        });
        // res.redirect(`http://localhost:8080/encuesta`);
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.facebookSuccess = facebookSuccess;
const logoutFacebook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
        });
        res.redirect('/v1/home');
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.logoutFacebook = logoutFacebook;
const googleSuccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({
            msg: 'login google ok...',
            user: req.user
        });
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.googleSuccess = googleSuccess;
const googleFailure = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            msg: 'Error...'
        });
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.googleFailure = googleFailure;
const logoutGoogle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
        });
        res.redirect('/v1/home');
    }
    catch (err) {
        res.status(500).json({
            message: `An error ocurred ${err}`
        });
        next(err);
    }
});
exports.logoutGoogle = logoutGoogle;
