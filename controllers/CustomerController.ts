import express, {Request, Response, NextFunction} from 'express';
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { CreateCustomerInput } from '../dto/Customer.dto';
import { GeneratePassword, GenerateSalt } from '../utility';
import { Customer } from '../models/Customer';
import { GenerateOtp, OnRequestOTP } from '../utility/NotificationUtility';
import { GenerateSignature } from '../utility/PasswordUtility';

export const CustomerSignUp = async (req: Request, res:Response, next: NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInput, req.body)

    const inputErrors = await validate(customerInputs, { validationError: {target: true}})

    if(inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const {email, phone, password} = customerInputs

    const salt = await GenerateSalt()
    const userPassword = await GeneratePassword(password, salt)

    const {otp, expiry} = GenerateOtp()

    const existCustomer = await Customer.findOne({ email: email })

    if(existCustomer !== null){
        return res.status(409).json({message: 'An user exist with the provided email ID'})
    }

    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0
    })

    if(result){
        //  Send the OTP to customer 
        await OnRequestOTP(otp, phone)

        //  Generate The Signature 
        const signature = GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })
        //  Send The Result To Client
        return res.status(201).json({signature: signature, verified: result.verified, email: result.email})
    }

    return res.status(400).json({message: "Error With Signup"})

}

export const CustomerLogin = async (req: Request, res:Response, next: NextFunction) => {

}

export const CustomerVerify = async (req: Request, res:Response, next: NextFunction) => {


}

export const RequestOtp = async (req: Request, res:Response, next: NextFunction) => {

}

export const GetCustomerProfile = async (req: Request, res:Response, next: NextFunction) => {

}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

}