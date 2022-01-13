//  Email 

//  Notification

//  OTP
export const GenerateOtp = () => {

    //  Generate Six Digit OTP Number 
    const otp = Math.floor(100000 + Math.random() * 900000)

    let expiry = new Date()

    //  Adding 30mins Extra To Expiry Date Obj
    expiry.setTime( new Date().getTime() + (30 * 60 * 1000))

    return {otp, expiry}

}

export const OnRequestOTP = async (otp:Number, toPhoneNumber:String) => {

    const accountSid = ""
    const authToken = ""
    const client = require('twilio')(accountSid, authToken)

    const response = await client.messages.create({
        body:`Your OTP is ${otp}`,
        from: '+16627802223',
        to: `+44${toPhoneNumber}`,
    })
    console.log(response)
    return response
}

//  Payment Notification OR Emails
