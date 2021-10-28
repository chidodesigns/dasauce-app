import express, { Request, Response, NextFunction} from 'express'
import {AddFood, GetFoods, GetVendorProfile, UpdateVendorProfile, UpdateVendorService, VendorLogin, UpdateVendorCoverImage, GetOrders, ProcessOrder, GetCurrentOrders, GetOrderDetails} from '../controllers'
import { Authenticate } from '../middlewares'
const multer = require('multer')

const router = express.Router()

const imageStorage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: any) {
        cb(null, 'images')
    },
    filename: function(req: Request, file: any, cb: any){
        cb(null, new Date().toISOString()+'_'+file.originalname)
    }
})

const images = multer({ storage: imageStorage}).array('images', 10)

router.post('/login', VendorLogin)

router.use(Authenticate)

//  Vendor Profile
router.get('/profile' ,GetVendorProfile)
router.patch('/profile', UpdateVendorProfile)
router.patch('/coverimage', images, UpdateVendorCoverImage)
router.patch('/service', UpdateVendorService)

//  Vendor Foods
router.post('/food', images, AddFood)
router.get('/foods', GetFoods)

//  Vendor Orders
router.get('/orders', GetCurrentOrders)
router.put('/order/:id/process', ProcessOrder)
router.get('/order/:id', GetOrderDetails)



router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello From Vendor"})
})

export { router as VendorRoute }

