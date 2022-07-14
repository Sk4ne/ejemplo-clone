import { Router } from 'express'
import { check } from 'express-validator'
import { validateFields } from '../middlewares/validateFields';
import { login } from '../controllers/auth'
import {
    addUser,
    deleteUser,
    getUsers,
    updateUser
} from '../controllers/userController';
import { validateJwt } from '../middlewares/validateJwt';

const router: Router = Router();

router.get('/users',validateJwt,getUsers)

router.post('/user',[
  check('email','Email is not valid').isEmail(),
  check('password')
    .isLength({min:5})
    .withMessage('Password must be at least 5 chars long')
    /**
     * Expresion regular permite caracteres [0-9] 
     * Una contraseña segura debe tener al menos dos números, una letra mayuscula 
     * y/o minuscula, y un caracteres especial
      
    */
    .matches(/\d/) 
    .withMessage('La contraseña debe contener números'),
  validateFields,
],addUser)

/**
 * Login user 
*/
router.post('/user/login',login)
router.put('/user/:id', updateUser)
router.delete('/user/:id', deleteUser)

export default router;

