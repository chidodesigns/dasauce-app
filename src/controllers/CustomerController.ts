import express, { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateCustomerInput, UserLoginInputs, EditCustomerProfileInputs, OrderInputs} from "../dto/Customer.dto";
import { GeneratePassword, GenerateSalt } from "../utility";
import { Customer } from "../models/Customer";
import { GenerateOtp, OnRequestOTP } from "../utility/NotificationUtility";
import { GenerateSignature, ValidatePassword } from '../utility/PasswordUtility';
import { Food } from "../models";
import { Order } from "../models/Order";

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
    orders: []
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
        phone: result.phone
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
     res.status(400).json({ message: "Error With Request OTP" });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const customer = req.user

    if(customer){
        const profile = await Customer.findById(customer._id)
        if(profile){

           return res.status(200).json(profile)
        }
    }

    return res.status(400).json({message: "Error with getting profile"})

};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const customer = req.user

    const profileInputs = plainToClass(EditCustomerProfileInputs , req.body)

    const profileErrors = await validate(profileInputs, {validationError: {target: false}})

    const { firstName, lastName, address } = profileInputs

    if(profileErrors.length > 0){
        return res.status(400).json(profileErrors)
    }

    if(customer){
        const profile = await Customer.findById(customer._id)
        if(profile){

            profile.firstName = firstName
            profile.lastName = lastName
            profile.address = address
        
            const result = await profile.save()

            res.status(200).json(result)
        }
    }

};

//  Cart
export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {

  const customer = req.user;

  if(customer) {

    const profile = await Customer.findById(customer._id).populate('cart.food')
    let cartItems = Array()
    const { _id, unit} = <OrderInputs>req.body

    const food = await Food.findById(_id)

    if(food){

      if(profile != null){
        //  Check For Cart Items
        cartItems = profile.cart
        if(cartItems.length > 0) {
          //  Check and Update Unit
          let existFoodItem = cartItems.filter((item) => item.food._id.toString() === _id)

          if(existFoodItem.length > 0){
            const index = cartItems.indexOf(existFoodItem[0])
            if (unit > 0){
              cartItems[index] = {food, unit}
            } else{
              cartItems.splice(index, 1)
            }
          }else{
            cartItems.push({ food, unit})
          }

        }else{
          //  Add New Item To Cart
          cartItems.push({ food, unit})
        }

        if(cartItems){
          profile.cart = cartItems as any;
          const cartResult = await profile.save()
          return res.status(200).json(cartResult.cart)
        }
  
      }

    }


  }
  return res.status(400).json({message: "Unable to Add To Cart"})
  

}

export const GetCart = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user 
    if(customer){
      const profile = await Customer.findById(customer._id).populate('cart.food')
      if(profile){
        return res.status(200).json(profile.cart)
      }
    }
    return res.status(400).json({message: 'Cart Is Empty'})
}

export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user 
  if(customer){
    const profile = await Customer.findById(customer._id).populate('cart.food')
    if(profile != null){
      profile.cart = [] as any
      const cartResult = await profile.save()
      return res.status(200).json(cartResult)
    }
  }
  return res.status(400).json({message: 'Cart Is Already Empty'})
}

export const CreateOrder =  async (req: Request, res: Response, next: NextFunction) => {

  //  Grab Current Login Customer
  const customer  = req.user
  if(customer){
    //  Create An Order ID
    const orderId =  `${Math.floor(Math.random() * 89999) + 1000}`

    const profile = await Customer.findById(customer._id)

    const cart  = <[OrderInputs]>req.body // { id: XX, unit: XX}

    let cartItems = Array()

    let netAmount = 0.0

    //  Calculate Order Amount 
    const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec()

    foods.map( food => {
      cart.map(({_id, unit}) => {
        if (food._id == _id){
          netAmount += (food.price * unit)
          cartItems.push({food, unit})
        }
      })
    })

    //  Create Order with Item description 
    if (cartItems){
        //  Create Order 
        const currentOrder = await Order.create({
          orderID: orderId,
          items: cartItems,
          totalAmount: netAmount,
          orderDate: new Date(),
          paidThrough: 'COD',
          paymentResponse: '',
          orderStatus: 'Waiting'
        })
        if(currentOrder){
          profile.orders.push(currentOrder)
          // const profileResponse = await profile.save()
          await profile.save()
          return res.status(200).json(currentOrder)
        }
    }
    //  Finally Update Orders To User Account 

  }
  return res.status(400).json({message: "Error With Create Order"})  

}

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
  //  Grab Current Login Customer
  const customer  = req.user
  if(customer){

    const profile = await Customer.findById(customer._id).populate("orders")

    if(profile){
      return res.status(200).json(profile.orders)
    }

  }
}

export const GetOrdersById = async (req: Request, res: Response, next: NextFunction) => {

  const orderId = req.params.id

  if(orderId){
    const order = await (await Order.findById(orderId)).populate('items.food')

    res.status(200).json(order)
  }

}