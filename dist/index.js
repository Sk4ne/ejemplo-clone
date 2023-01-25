"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./db/config");
/** swagger  */
/* INTERFAZ GRAFICA DE LA DOCUMENTACION */
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// import { options } from './swaggerOptions' ORIGINAL
const swaggerDoc_1 = require("./swaggerDoc");
'./middlewares/authGoogle';
'./middlewares/authFacebook';
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
/** routes v1 */
const v1_1 = __importDefault(require("./routes/v1"));
'./middlewares/isLoggedIn';
const app = (0, express_1.default)();
app.use((0, cookie_session_1.default)({
    name: process.env.NAME_COOKIE,
    keys: ['key1', 'key2']
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, morgan_1.default)('tiny'));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
/**application/x-www-form-urlencoded */
app.use(express_1.default.urlencoded({ extended: true }));
/** jsDocs */
// const specs = swaggerJsDoc(options) ORIGINAL;
/** Middlewares router */
app.use('/v1', v1_1.default);
/**swagger */
// app.use('/v1/docs',swaggerUi.serve,swaggerUi.setup(specs)) ORIGINAL;
app.use('/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDoc_1.swaggerConfig));
app.use(express_1.default.static('public'));
const history = require('connect-history-api-fallback');
app.use(history());
/** Connection database */
app.listen(process.env.PORT || 3000, () => {
    console.log(`Listen on port ${process.env.PORT}`);
});
