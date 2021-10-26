"use strict";
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
exports.ValidateSignature = exports.GenerateSignature = exports.ValidatePassword = exports.GeneratePassword = exports.GenerateSalt = void 0;
const config_1 = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.genSalt();
});
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.hash(password, salt);
});
exports.GeneratePassword = GeneratePassword;
const ValidatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    //  Compare Passwords
    return (yield (0, exports.GeneratePassword)(enteredPassword, salt)) === savedPassword;
});
exports.ValidatePassword = ValidatePassword;
const GenerateSignature = (payload) => {
    return jwt.sign(payload, config_1.APP_SECRET, { expiresIn: "1d" });
};
exports.GenerateSignature = GenerateSignature;
const ValidateSignature = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.get('Authorization');
    if (signature) {
        const payload = yield jwt.verify(signature.split(' ')[1], config_1.APP_SECRET);
        req.user = payload;
        return true;
    }
    return false;
});
exports.ValidateSignature = ValidateSignature;
//# sourceMappingURL=PasswordUtility.js.map