import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { createPaymentUrl, vnpayIPN, vnpayReturn } from '~/controllers/paymentController'

const router = express.Router()


router.post('/create-payment-url', authMiddleware.isAuthorized, createPaymentUrl)
router.get('/vnpay-ipn', vnpayIPN)
router.get('/vnpay-return', authMiddleware.isAuthorized, vnpayReturn)


export const paymentRoute = router