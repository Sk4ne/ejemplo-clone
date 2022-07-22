## Pasos para crear un login de usuario

* El primer paso es crear la ruta, * creamos un archivo auth en la carpeta controller 
* Obtenemos el email y la password de req.body * Verificamos que el email exista con findOne({email}) 
* Verificar que el usuario este activo 
* Verificar que la contraseña sea correcta 
* Generar el JWT (En la carpeta helpers creamos el archivo para generar el token) generar-jwt.ts.
* Creamos un middleware para proteger las rutas (validar-jwt.js)
* Validamos el rol - creamos un archivos validar-roles.js (rol admin) carpeta middlewares
* IMPORTAMOS EN LA CARPETA ROUTES los archivos de validaciones

## TASK
- [x] Desintalar los paquetes que no se este usando
- [x] Implementar express-validator en la ruta question.
- [x] Validar que se ingrese una typeQuestion Valid al hacer el push a un array de Question
- [x] Eliminar un pregunta del array Question.
- [x] Validar que el titulo de las preguntas sea unico.
- [x] Crear el modelo de usuario
- [x] Validación de la contraseña
- [x] Aplicar validaciones en la ruta
- [x] Ruta login
- [ ] Definir los roles de usuario  y el login.
- [x] Crear un ruta para eliminar todos los usuarios
- [x] Validar que el usuario ingrese una contraseña segura
- [x] Optimizar la validación de la contraseña
- [ ] Img por defecto al crear un usuario