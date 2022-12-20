export const options = {
  definition: {
    openapi:"3.0.0",
    info:{
      title:'Survey API',
      version:'1.0.0',
      description:'Esta API llamada survey permite generan encuestas por medio de preguntas abierta y/o cerradas y a su vez descargarlas en formato pdf.'
    },
    servers:[
      {
        url:'http://localhost:3000/v1'
      }
    ]
  },
  // apis:['./src/routes/v1/*.ts'] swaggerJsDoc
  apis:['./src/swaggerDoc.ts'] /* JSON */
}