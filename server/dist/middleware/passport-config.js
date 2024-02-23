"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
dotenv_1.default.config();
passport_1.default.initialize();
// This is the configuration for the passport-jwt strategy. It is used to authenticate users based on the JWT token sent by the client.
const jwtStrategyOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
};
const jwtStrategy = new passport_jwt_1.Strategy(jwtStrategyOptions, async (payload, done) => {
    try {
        const user = await User_1.User.findById(payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }
    catch (error) {
        return done(error, false);
    }
});
exports.default = passport_1.default.use(jwtStrategy);
