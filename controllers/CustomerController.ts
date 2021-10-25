import express, { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateCustomerInput, UserLoginInputs } from "../dto/Customer.dto";
import { GeneratePassword, GenerateSalt } from "../utility";
import { Customer } from "../models/Customer";
import { GenerateOtp, OnRequestOTP } from "../utility/NotificationUtility";
import { GenerateSignature, ValidatePassword } from '../utility/PasswordUtility';

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerInput, req.body);

  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password } = customerInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = GenerateOtp();

  const existCustomer = await Customer.findOne({ email: email });

  if (existCustomer !== null) {
    return res
      .status(409)
      .json({ message: "An user exist with the provided email ID" });
  }

  const result = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
  });

  if (result) {
    //  Send the OTP to customer
    await OnRequestOTP(otp, phone);

    //  Generate The Signature
    const signature = GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });
    //  Send The Result To Client
    return res
      .status(201)
      .json({
        signature: signature,
        verified: result.verified,
        email: result.email,
      });
  }

  return res.status(400).json({ message: "Error With Signup" });
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    const loginInputs = plainToClass(UserLoginInputs, req.body)

    const loginErrors = await validate(loginInputs, {validationError: {target: false}})

    if(loginErrors.length > 0){
        return res.status(400).json(loginErrors)
    }

    const { email, password } = loginInputs

    const customer = await Customer.findOne({ email: email})

    if(customer){
        const validation = await ValidatePassword(password, customer.password, customer.salt)

        if(validation){
            const signature = GenerateSignature({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            })
            
            return res.status(201).json({
                signature: signature,
                verified: customer.verified,
                email: customer.email
            })
        }
    }

    return res.status(404).json({message: "Error with Login"})

};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;
        const updatedCustomerResponse = await profile.save();
        const signature = GenerateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });
        return res
          .status(200)
          .json({
            signature: signature,
            verified: updatedCustomerResponse.verified,
            email: updatedCustomerResponse.email,
          });
      }
    }
  }
  return res.status(400).json({ message: "Error With OTP Validation" });
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const customer = req.user
    if(customer){
        const profile = await Customer.findById(customer._id)
        if(profile){
            const { otp, expiry} = await GenerateOtp()
            profile.otp_expiry = expiry

            await profile.save()

            await OnRequestOTP(otp, profile.phone)

            res.status(200).json({message: "OTP sent your registered number"})
        }
    }
    return res.status(400).json({ message: "Error With Request OTP" });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
