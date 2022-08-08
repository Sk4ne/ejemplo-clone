import { Router } from 'express'
import questionRouter from './question'
import userRouter from './user'
// import loginRouter from './authSocial'

const router: Router = Router()
// const loginR: Router = Router()
router.use(questionRouter)
router.use(userRouter)
// loginR.use(loginRouter)

export default router

