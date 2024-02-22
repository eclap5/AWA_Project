import express, { Request, Response, Router } from "express"
import bcrypt from "bcrypt"
import { ValidationError, validationResult, Result, body } from "express-validator"
import jwt, { JwtPayload } from "jsonwebtoken"
import { validateToken } from "../middleware/validateToken"
import { validateEmail, validatePassword } from "../validators/inputValidation"
import { User, IUser } from "../models/User"
import { ChatSession, IChatSession } from "../models/ChatSession"


const router: Router = express.Router()

router.get('/', (req: Request, res: Response) => {
    res.json({message: 'this is index page'})
})

router.post('/api/users/register',
validateEmail, validatePassword,
async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const existingUser: IUser | null = await User.findOne({ email: req.body.email })

        if (existingUser) {
            return res.status(401).json({ email: 'Email already in use.' })
        }

        const salt: string = bcrypt.genSaltSync(10)
        const hash: string = bcrypt.hashSync(req.body.password, salt)

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
            return res.status(401).json({ message: 'Login failed' })
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
        console.log(req.user)
        const loggedUser: IUser | null = await User.findById((req.user as {_id: string})._id)
        const users: IUser[] = await User.find({
            $and: [
                { _id: { $ne: loggedUser?._id } },
                { _id: { $nin: loggedUser?.usersLiked } },
                { _id: { $nin: loggedUser?.matches } }
            ]
        }).select('-password -email -timeCreated -matches')
        return res.json(users)
    } catch (error: any) {
        console.error(`Error during fetching users: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/api/users/:id', validateToken, async (req: Request, res: Response) => {
    const user: IUser | null = await User.findById(req.params.id)

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    return (res.json(user))
})

router.patch('/api/users/:id', validateToken, async (req: Request, res: Response) => {
    try {
        console.log(req.params.id, req.body)
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
            await likedUser?.save()
        }

        if (req.body.username || req.body.pc || req.body.xbox || req.body.playstation || req.body.genres || req.body.freeText) {
            user.username = req.body.username || user.username
            user.pc = req.body.pc
            user.xbox = req.body.xbox
            user.playstation = req.body.playstation
            user.genres = req.body.genres || user.genres
            user.freeText = req.body.freeText || user.freeText
        }
        await user.save()
        return res.json({ message: 'User updated successfully' })
    } catch (error: any) {
        console.error(`Error during updating user: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.post('/api/chat', validateToken, async (req: Request, res: Response) => {

    try {
        await ChatSession.create({
            user1: req.body.user1,
            user2: req.body.user2,
            messages: []
        })
        return res.status(201).json({ message: 'Chat session created successfully' })
    } catch (error: any) {
        console.error(`Error during chat session creation: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/api/chat', validateToken, async (req: Request, res: Response) => {
    try {
        const chatSessions: IChatSession[] = await ChatSession.find({
            $or: [
                { user1: (req.user as {_id: string})._id },
                { user2: (req.user as {_id: string})._id }
            ]
        })
        return res.json(chatSessions)
    } catch (error: any) {
        console.error(`Error during fetching chat sessions: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.post('/api/chat/messages', validateToken, async (req: Request, res: Response) => {
    try {
        const chatSession: IChatSession | null = await ChatSession.findById(req.body.chatId)
        if (!chatSession) {
            return res.status(404).json({ message: 'Chat session not found' })
        }
        chatSession.messages.push({
            senderId: req.body.senderId,
            message: req.body.message,
            timestamp: req.body.timestamp
        })
        await chatSession.save()
        return res.json({ message: 'Message sent successfully' })
    } catch (error: any) {
        console.error(`Error during sending message: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/api/chat/messages/:id', validateToken, async (req: Request, res: Response) => {
    try {
        const chatSession: IChatSession | null = await ChatSession.findById(req.params.id)
        if (!chatSession) {
            return res.status(404).json({ message: 'Chat session not found' })
        }
        return res.json(chatSession.messages)
    } catch (error: any) {
        console.error(`Error during fetching messages: ${error}`)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

export default router