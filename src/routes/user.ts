import { NextFunction, Router } from 'express'
import { check } from 'express-validator'
import { validateFields } from '../middlewares/validateFields';
import { login } from '../controllers/auth'
import {
    addUser,
    deleteAllUsers,
    deleteUser,
    getUsers,
    updateUser
} from '../controllers/userController';
import { validateJwt } from '../middlewares/validateJwt';
import { existEmail } from '../helpers/existEmailUser';
import { validPass } from '../helpers/regexPass';


const router: Router = Router();

/** validateJwt - Verify that a token is included in the request.  */
router.get('/users',validateJwt,getUsers)
router.post('/user',[
  check('email')
    .custom(existEmail),
  check('email','Email is not valid')
    .isEmail(),
  check('password')
    .custom(validPass),
  validateFields
],addUser)

/** ruta login */
router.post('/user/login',login)
router.put('/user/:id', updateUser)
router.delete('/user/:id', deleteUser)
router.delete('/all-users',deleteAllUsers)

/* Test queries findOne */
// router.get('/only-doc',validPass)

export default router;

