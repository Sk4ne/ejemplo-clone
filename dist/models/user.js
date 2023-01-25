"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const validRole = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
};
const userSchema = new mongoose_1.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    img: { type: String, default: 'https://res.cloudinary.com/dqhme1rod/image/upload/v1657230171/xfzbvm7rlpapsoa0dndm.png' },
    role: { type: String, enum: validRole, default: 'ADMIN_ROLE' },
    /* services: {
      facebook: { type:Boolean, default:false},
      google: { type:Boolean,default:false }
    }, */
    facebook: { type: Boolean, default: false },
    google: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now() },
    state: { type: Boolean, default: true },
}, { versionKey: false });
userSchema.plugin(mongoose_unique_validator_1.default);
userSchema.methods.toJSON = function () {
    const _a = this.toObject(), { password } = _a, user = __rest(_a, ["password"]);
    return user;
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
