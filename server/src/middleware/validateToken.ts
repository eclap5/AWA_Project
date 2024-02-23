import { Request, Response, NextFunction } from "express"
import { JwtPayload } from "jsonwebtoken"
import passport from "./passport-config"

interface CustomRequest extends Request {
    user?: JwtPayload
}

// This middleware function is used to validate the token sent by the client, to ensure that the user is authenticated.
export const validateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: Error | null, verifiedUser: JwtPayload | null) => {
        if (err || !verifiedUser) {
            return res.sendStatus(403)
        }
        req.user = verifiedUser
        next()
    })(req, res, next)
}