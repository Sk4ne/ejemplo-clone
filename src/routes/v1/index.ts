/** importamos los middlewares aquí porque las rutas los necesitan */

import '../../middlewares/authFacebook'
import '../../middlewares/authGoogle'
import { Router } from 'express'
import surveyRouter from './survey'
import userRouter from './user'

const router: Router = Router()
router.use(surveyRouter)
router.use(userRouter)


export default router

