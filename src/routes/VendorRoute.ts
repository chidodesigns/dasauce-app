import express, { Request, Response, NextFunction} from 'express'
import {AddFood, GetFoods, GetVendorProfile, UpdateVendorProfile, UpdateVendorService, VendorLogin, UpdateVendorCoverImage} from '../controllers'
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

router.get('/profile' ,GetVendorProfile)
router.patch('/profile', UpdateVendorProfile)
router.patch('/coverimage', images, UpdateVendorCoverImage)
router.patch('/service', UpdateVendorService)

router.post('/food', images, AddFood)
router.get('/foods', GetFoods)

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello From Vendor"})
})

export { router as VendorRoute }

