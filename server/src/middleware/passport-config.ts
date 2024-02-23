import { JwtPayload } from "jsonwebtoken"
import passport, { DoneCallback } from "passport"
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt"
import dotenv from "dotenv"
import { User, IUser } from "../models/User"

dotenv.config()
passport.initialize()

// This is the configuration for the passport-jwt strategy. It is used to authenticate users based on the JWT token sent by the client.
const jwtStrategyOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET as string
}

const jwtStrategy = new Strategy(jwtStrategyOptions, async (payload: JwtPayload, done: DoneCallback) => {
    try {
        const user: IUser | null = await User.findById(payload.id)
        if (user) {
            return done(null, user)
        }
        return done(null, false)
    } catch (error) {
        return done(error, false)
    }
})

export default passport.use(jwtStrategy)