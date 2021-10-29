import express, { Request, Response, NextFunction} from 'express';
import { CustomerSignUp, CustomerLogin, CustomerVerify, RequestOtp, GetCustomerProfile, EditCustomerProfile, CreateOrder, GetOrders, GetOrderById, VerifyOffer, CreatePayment, AddToCart, GetCart, DeleteCart} from '../controllers/CustomerController';
import { Authenticate } from '../middlewares/CommonAuth';

const router = express.Router()

/** Signup / Create Customer  */
router.post('/signup', CustomerSignUp)
/** Login  */
router.post('/login', CustomerLogin)

//  Routes Require Authentication
router.use(Authenticate)
/** Verify Customer Account */
router.patch('/verify', CustomerVerify)
/** OTP / Requesting OTP  */
router.get('/otp', RequestOtp)
/** Profile */
router.get('/profile', GetCustomerProfile)
router.patch('/profile', EditCustomerProfile)

//  Cart
router.post('/cart', AddToCart)
router.get('/cart', GetCart)
router.delete('/cart', DeleteCart)

//  Apply Offers
router.get('/offer/verify/:id', VerifyOffer)

//  Order
router.post('/create-order', CreateOrder)
router.get('/orders', GetOrders)
router.get('/order/:id', GetOrderById)

//  Payment
router.post('/create-payment', CreatePayment)

export { router as CustomerRoute}