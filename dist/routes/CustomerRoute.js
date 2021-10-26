"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const CustomerController_1 = require("../controllers/CustomerController");
const CommonAuth_1 = require("../middlewares/CommonAuth");
const router = express_1.default.Router();
exports.CustomerRoute = router;
/** Signup / Create Customer  */
router.post('/signup', CustomerController_1.CustomerSignUp);
/** Login  */
router.post('/login', CustomerController_1.CustomerLogin);
//  Routes Require Authentication
router.use(CommonAuth_1.Authenticate);
/** Verify Customer Account */
router.patch('/verify', CustomerController_1.CustomerVerify);
/** OTP / Requesting OTP  */
router.get('/otp', CustomerController_1.RequestOtp);
/** Profile */
router.get('/profile', CustomerController_1.GetCustomerProfile);
router.patch('/profile', CustomerController_1.EditCustomerProfile);
//# sourceMappingURL=CustomerRoute.js.map