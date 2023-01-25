"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const multer_1 = __importDefault(require("multer"));
/**
 * Arrays TS: Array<string>
 * :string[]
*/
exports.storage = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({}),
    /* With this function we control which files should be uploaded and which should be skipped.   */
    fileFilter: (req, file, cb) => {
        let validExtens = ['png', 'jpeg', 'svg', 'jpg'];
        if (file.mimetype.match(/png|jpeg|svg|jpg/gi) === null) {
            throw new Error(`Image not supported. Allowed extension ${validExtens}`);
        }
        else {
            cb(null, true);
        }
    }
});
