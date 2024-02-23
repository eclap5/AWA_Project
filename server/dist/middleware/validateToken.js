"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const passport_config_1 = __importDefault(require("./passport-config"));
// This middleware function is used to validate the token sent by the client, to ensure that the user is authenticated.
const validateToken = (req, res, next) => {
    passport_config_1.default.authenticate('jwt', { session: false }, (err, verifiedUser) => {
        if (err || !verifiedUser) {
            return res.sendStatus(403);
        }
        req.user = verifiedUser;
        next();
    })(req, res, next);
};
exports.validateToken = validateToken;
