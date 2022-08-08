import { Router } from 'express'
import questionRouter from './question'
import userRouter from './user'

const router: Router = Router()
router.use(questionRouter)
router.use(userRouter)

export default router

