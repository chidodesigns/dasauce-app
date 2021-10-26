"use strict";
//  Email 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnRequestOTP = exports.GenerateOtp = void 0;
//  Notification
//  OTP
const GenerateOtp = () => {
    //  Generate Six Digit OTP Number 
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    //  Adding 30mins Extra To Expiry Date Obj
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiry };
};
exports.GenerateOtp = GenerateOtp;
const OnRequestOTP = (otp, toPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSid = "ACc37cbc5caaec14745288e686f4de1440";
    const authToken = "e0064772a7bc13e4ece629d848244586";
    const client = require('twilio')(accountSid, authToken);
    const response = yield client.messages.create({
        body: `Your OTP is ${otp}`,
        from: '+16627802223',
        to: `+44${toPhoneNumber}`,
    });
    return response;
});
exports.OnRequestOTP = OnRequestOTP;
//  Payment Notification OR Emails
//# sourceMappingURL=NotificationUtility.js.map