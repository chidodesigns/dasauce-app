
import {Request, Response, NextFunction} from 'express'
import { FindVendor } from './AdminController'
import { EditVendorInput, VendorLoginInputs } from '../dto'
import { GenerateSignature, ValidatePassword } from '../utility'

export const VendorLogin = async (req: Request, res: Response, next: NextFunction ) => {

    const {email, password} = <VendorLoginInputs>req.body

    const existingVendor = await FindVendor('', email)

    if (existingVendor !== null) {

        //  Validation and Give Access
        const validation = await ValidatePassword(password, existingVendor.password, existingVendor.salt) 

        if (validation) {

            const signature = GenerateSignature({
                _id: existingVendor.id,
                email: existingVendor.email,
                foodTypes: existingVendor.foodType,
                name: existingVendor.name
            })

            return res.json(signature)
        }else{
            return res.json({"message": "Password is not valid"})
        }

    }

    return res.json({"message": "Login credential not valid"})

}

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if(user){
        const existingVendor = await FindVendor(user._id)
        return res.json(existingVendor)
    }
    return res.json({"message": "Vendor nout found"})
}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {

    const {foodTypes, name, address, phone} = <EditVendorInput>req.body
    const user = req.user

    if(user){
        const existingVendor = await FindVendor(user._id)

        if(existingVendor !== null){
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodTypes
            
            const savedResult = await existingVendor.save()
            return res.json(savedResult)
        }
        return res.json(existingVendor)
    }
    return res.json({"message": "Vendor nout found"})
    
}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user

    if(user){
        const existingVendor = await FindVendor(user._id)

        if(existingVendor !== null){
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable
            const savedResult = await existingVendor.save()
            return res.json(savedResult)
        }
        return res.json(existingVendor)
    }
    return res.json({"message": "Vendor nout found"})
    
}