import { Request } from "express";
import { APP_SECRET } from "../config";
import { VendorPayload } from "../dto";
import { AuthPayload } from "../dto/Auth.dto";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  //  Compare Passwords
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = (payload: VendorPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};

export const ValidateSignature = async (req: Request) => {

    const signature =  req.get('Authorization')

    if (signature) { 

        const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET) as AuthPayload
        req.user = payload
        return true

    }

    return false

}