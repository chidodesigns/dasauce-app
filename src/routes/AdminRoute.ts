import express, { Request, Response, NextFunction} from 'express'
import { CreateVendor, GetTransactionById, GetTransactions, GetVendorByID, GetVendors } from '../controllers'

const router = express.Router()

router.post('/vendor', CreateVendor)
router.get('/vendors', GetVendors)
router.get('/vendor/:id', GetVendorByID)

router.get('/transactions', GetTransactions)
router.get('/transaction/:id', GetTransactionById)

router.get('/', (req:Request, res: Response,  next: NextFunction) => {
    res.json({message: "Hello From Admin"})
})

export { router as AdminRoute }

