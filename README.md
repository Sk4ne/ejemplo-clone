## Generador de Encuestas

Esta es una API que permite generar encuestas, mediante el uso de preguntas abiertas o de opción múltiple. En este proyecto estoy poniendo en practica el conocimiento que adquiri en un curso de typescript que realice hace un par de meses y perfeccionando lo que he aprendido de `NodeJS`,el framework `express` y `MongoDB` en el transcurso de los dos últimos años. En esta `API` he implementado lo siguiente:

* `JWT` para la autenticación de usuarios y manejo de roles.
* `Nodemailer` para la envío de correos desde el backend.
* `Api - Cloudinary` para la el almacenamiento de imagenes - el crud completo, subida, edición, eliminación y actualización.
* `Postman` para testear los EndPoints y general la documentación automática de la API.
* `TypeScript` para añadir tipado, y construir una api más robusta y con un código más facil de mantener.
* `Passport.js` para la autenticación con redes sociales como facebook. 
* `Swagger` para documentar la API
* `jest y supertest` para hacer el testing de la API.
* `express-validator` para validar la data y que que cumpla con ciertos paramametros, por ejemplo que una contraseña contenga cierto tipo de caracteres. 
* `Railway` para hacer el deploy de la API

### Consideraciones
Esta api esta en fase de desarrollo,cada vez que tengo tiempo libre agrego nuevas funcionalidades y/o realizo optimizaciones en el código fuente.  

### Retos
* Tuve dificultades para implementar la autenticación con redes sociales (Facebook y Google), el código que estaba escribiendo no era capaz de identificar con que red social se estaba logueando el usuario. Afortunadamente existe buena documentación sobre Passport-facebook y google-facebook y puede implementar una solución viable. 

Despues de descargar el proyecto...

## Ejecutar

```
 npm install 
```
Para reconstruir los módulos de nodejs.

## Compilar ts

```
 npm run watch
```
