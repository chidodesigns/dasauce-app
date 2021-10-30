import {Request, Response, NextFunction} from 'express'
import { CreateVendorInput } from '../dto'
import { Transaction, Vendor } from '../models'
import { GeneratePassword, GenerateSalt } from '../utility'

//  email is optional
export const FindVendor = async (id: string | undefined, email?: string) => {
    if (email) {
        return await Vendor.findOne({email:email})
    }else{
        return await Vendor.findById(id)
    }
}

export const CreateVendor = async (req:Request, res:Response, next:NextFunction) => {
 
    const {name, address, pincode, foodType, email, password, ownerName, phone } = <CreateVendorInput>req.body

    const existingVendor = await FindVendor('', email)

    if(existingVendor !== null){
        return res.json({"message": "A vendor already exists with this email address"})
    }

    //  Generate Password Salt
    const salt = await GenerateSalt()
    const userPassword = await GeneratePassword(password, salt)
    //  Encrypt Password Using Salt

    const createdVendor = await Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        foods: [],
    })

    return res.json(createdVendor)

}

export const GetVendors = async (req:Request, res:Response, next:NextFunction) => {
 
    const vendors = await Vendor.find()

    if(vendors !== null){
        return res.json(vendors)
    }

    return res.json({"message": "vendors data not available"})
    
}

export const GetVendorByID = async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id
    const vendor = await FindVendor(vendorId)

    if(vendor !== null){
        return res.json(vendor)
    }

    return res.json({"message": "vendors data not available"})
}

export const GetTransactions = async (req:Request, res:Response, next: NextFunction) => {
    const transactions = await Transaction.find()
    if(transactions){
        return res.status(200).json(transactions)
    }
    return res.json({"message": "Transactions not available"})
}

export const GetTransactionById = async (req:Request, res:Response, next: NextFunction) => {
    const id = req.params.id
    const transaction = await Transaction.findById(id)
    if(transaction){
        return res.status(200).json(transaction)
    }
    return res.json({"message": "Transaction not available"})
}

