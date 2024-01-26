import express, { Request, Response, Router } from "express"
import bcrypt from "bcrypt"
import { ValidationError, validationResult, Result } from "express-validator"
import jwt, {JwtPayload} from "jsonwebtoken"
import { validateToken } from "../middleware/validateToken"
import { validateEmail, validatePassword } from "../validators/inputValidation"
import { User, IUser } from "../models/User"


const router: Router = express.Router()

router.get('/', (req: Request, res: Response) => {
    res.json({message: 'this is index page'})
})

router.post('/api/users/register',
async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const existingUser: IUser | null = await User.findOne({ email: req.body.email })

        if (existingUser) {
            return res.status(403).json({ email: 'Email already in use.' })
        }

        const salt: string = bcrypt.genSaltSync(10)
        const hash: string = bcrypt.hashSync(req.body.password, salt)
        console.log(req.body)

        await User.create({
            email: req.body.email,
            password: hash,
            username: req.body.username,
            pc: req.body.pc,
            xbox: req.body.xbox,
            playstation: req.body.playstation,
            genres: req.body.genres,
            freeText: req.body.freeText,
            usersLiked: [],
            matches: [],
            timeCreated: new Date()
        })
        return res.status(200).json({ message: 'User registered successfully.' })
    } catch (error: unknown) {
        console.error(`Error during user registration: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }   
})

router.post('/api/users/login', 
    validateEmail, 
    async (req: Request, res: Response) => {
    try {
        const user: IUser | null = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(403).json({ message: 'Login failed' })
        }
        
        if (bcrypt.compareSync(req.body.password, user.password)) {
            const jwtPayload: JwtPayload = {
                id: user._id,
                email: user.email,
                username: user.username
            }
            const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, { expiresIn: '60m' })
            return res.json({ success: true, token, userId: user._id })
        }
        return res.status(401).json({ message:'Invalid password' })
    } catch (error: any) {
        console.error(`Error during user login: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/api/users', validateToken, async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await User.find().select('-password -email -timeCreated -matches')
        console.log(users)
        return res.json(users)
    } catch (error: any) {
        console.error(`Error during fetching users: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.patch('/api/users/:id', validateToken, async (req: Request, res: Response) => {
    try {
        const user: IUser | null = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (req.body.usersLiked) {
            user.usersLiked.push(req.body.usersLiked)
        }

        if (req.body.matches) {
            const likedUser: IUser | null = await User.findById(req.body.matches)
            likedUser?.matches.push(req.params.id)
            user.matches.push(req.body.matches)
        }

        await user.save()
        return res.json({ message: 'User updated successfully' })
    } catch (error: any) {
        console.error(`Error during updating user: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

export default router