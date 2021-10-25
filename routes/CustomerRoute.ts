import express, { Request, Response, NextFunction} from 'express';
import { CustomerSignUp, CustomerLogin, CustomerVerify, RequestOtp, GetCustomerProfile, EditCustomerProfile } from '../controllers/CustomerController';
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
//  Order
//  Payment

export { router as CustomerRoute}