import express, { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import {
  UserLoginInputs,
  EditCustomerProfileInputs,
} from "../dto/Customer.dto";
import { GeneratePassword, GenerateSalt } from "../utility";

import {
  GenerateSignature,
  ValidatePassword,
} from "../utility/PasswordUtility";
import { CreateDeliveryUserInputs } from "../dto/Delivery.dto";
import { DeliveryUser } from "../models/DeliveryUser";

export const DeliveryUserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUserInputs = plainToClass(CreateDeliveryUserInputs, req.body);

  const inputErrors = await validate(deliveryUserInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password, address, firstName, lastName, pincode } =
    deliveryUserInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const existingDeliveryUser = await DeliveryUser.findOne({ email: email });

  if (existingDeliveryUser !== null) {
    return res
      .status(409)
      .json({ message: "A Delviery User exist with the provided email ID" });
  }

  const result = await DeliveryUser.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    firstName: firstName,
    lastName: lastName,
    address: address,
    pincode: pincode,
    verified: false,
    lat: 0,
    lng: 0,
    isAvailable: false,
  });

  if (result) {
    //  Generate The Signature
    const signature = GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });
    //  Send The Result To Client
    return res.status(201).json({
      signature: signature,
      verified: result.verified,
      email: result.email,
      phone: result.phone,
    });
  }

  return res.status(400).json({ message: "Error With Signup" });
};

export const DeliveryUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(UserLoginInputs, req.body);

  const loginErrors = await validate(loginInputs, {
    validationError: { target: false },
  });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }

  const { email, password } = loginInputs;

  const deliveryUser = await DeliveryUser.findOne({ email: email });

  if (deliveryUser) {
    const validation = await ValidatePassword(
      password,
      deliveryUser.password,
      deliveryUser.salt
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: deliveryUser._id,
        email: deliveryUser.email,
        verified: deliveryUser.verified,
      });

      return res.status(201).json({
        signature: signature,
        verified: deliveryUser.verified,
        email: deliveryUser.email,
      });
    }
  }

  return res.status(404).json({ message: "Error with Login" });
};

export const GetDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;

  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);
    if (profile) {
      return res.status(200).json(profile);
    }
  }

  return res.status(400).json({ message: "Error with getting profile" });
};

export const EditDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;
  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);
  const profileErrors = await validate(profileInputs, {
    validationError: { target: false },
  });
  const { firstName, lastName, address } = profileInputs;
  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }
  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);
    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
      const result = await profile.save();
      res.status(200).json(result);
    }
  }
  return res
    .status(400)
    .json({ message: "Error with fetching Delivery User profile" });
};

export const UpdateDeliveryUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;
  if (deliveryUser) {
    const { lat, lng } = req.body;
    const profile = await DeliveryUser.findById(deliveryUser._id);
    if (profile) {
      if (lat && lng) {
        profile.lat = lat;
        profile.lng = lng;
      }
      profile.isAvailable = !profile.isAvailable;
      const result = await profile.save();
      return res.status(200).json(result);
    }
  }
  return res.status(400).json({ message: "Error with Update Status" });
};

export const VerifyDeliveryUser = async (  req: Request,
    res: Response,
    next: NextFunction) => {
    const {_id, status} = req.body
    if(_id){
        const profile = await DeliveryUser.findById(_id)
        if(profile){
            profile.verified = status
            const result = await profile.save()
            return res.status(200).json(result)
        }
    }
    return res.status(400).json({"message": "Unable to verify Delivery User"})
}

export const GetDeliveryUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUsers = await DeliveryUser.find();
  if (deliveryUsers) {
    return res.status(200).json(deliveryUsers);
  }

  return res.status(400).json({ message: "Unable To Get Delivery Users   " });
};
