"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// mongoose.connect(urlDB,{useNewUrlParser:true},(err)=>{
let urlDB = process.env.URL_DB || '';
mongoose_1.default.connect(urlDB, (err) => {
    err ? console.log(`Error connection to the database ${err}`)
        : console.log('Connection to the established database');
});
