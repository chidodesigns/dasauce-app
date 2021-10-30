import express, { Request, Response, NextFunction } from "express";
import { DeliveryUserLogin, DeliveryUserSignUp } from "../controllers";
import {} from "../controllers/CustomerController";
import { Authenticate } from "../middlewares/CommonAuth";
import { GetDeliveryUserProfile, EditDeliveryUserProfile, UpdateDeliveryUserStatus } from '../controllers/DeliveryController';

const router = express.Router();

/** Signup / Create Customer  */
router.post("/signup", DeliveryUserSignUp);
/** Login  */
router.post("/login", DeliveryUserLogin);

//  Routes Require Authentication
router.use(Authenticate);

/* Change Service Status */
router.put('/change-status', UpdateDeliveryUserStatus)
/* Profile */
router.get("/profile", GetDeliveryUserProfile);
router.patch("/profile", EditDeliveryUserProfile);


export { router as DeliveryRoute };
