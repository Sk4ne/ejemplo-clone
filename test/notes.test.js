// import supertest from 'supertest'
const supertest = require('supertest')
const app = require('../src/index')
// import app from '../src/index'


const api = supertest(app)

test('notes are returned as json',async() => {
   await api 
    .get('/questions')
    .expect('200') 
    .expect('Content-Type',/application\/json/)
})