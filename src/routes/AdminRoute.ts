import express, { Request, Response, NextFunction} from 'express'
import { CreateVendor, GetDeliveryUsers, GetTransactionById, GetTransactions, GetVendorByID, GetVendors, VerifyDeliveryUser } from '../controllers'

const router = express.Router()

router.post('/vendor', CreateVendor)
router.get('/vendors', GetVendors)
router.get('/vendor/:id', GetVendorByID)

router.get('/transactions', GetTransactions)
router.get('/transaction/:id', GetTransactionById)

router.put('/delivery/verify', VerifyDeliveryUser)
router.get('/delivery/users', GetDeliveryUsers)

router.get('/', (req:Request, res: Response,  next: NextFunction) => {
    res.json({message: "Hello From Admin"})
})

export { router as AdminRoute }

