"use strict";
/** importamos los middlewares aquí porque las rutas los necesitan */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../middlewares/authFacebook");
require("../../middlewares/authGoogle");
const express_1 = require("express");
const survey_1 = __importDefault(require("./survey"));
const user_1 = __importDefault(require("./user"));
const router = (0, express_1.Router)();
router.use(survey_1.default);
router.use(user_1.default);
exports.default = router;
