"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken_1 = require("../middleware/validateToken");
const inputValidation_1 = require("../validators/inputValidation");
const User_1 = require("../models/User");
const ChatSession_1 = require("../models/ChatSession");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({ message: 'this is index page' });
});
router.post('/api/users/register', inputValidation_1.validateEmail, inputValidation_1.validatePassword, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const existingUser = await User_1.User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(401).json({ email: 'Email already in use.' });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        await User_1.User.create({
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
        });
        return res.status(200).json({ message: 'User registered successfully.' });
    }
    catch (error) {
        console.error(`Error during user registration: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/api/users/login', inputValidation_1.validateEmail, async (req, res) => {
    try {
        const user = await User_1.User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'Login failed' });
        }
        if (bcrypt_1.default.compareSync(req.body.password, user.password)) {
            const jwtPayload = {
                id: user._id,
                email: user.email,
                username: user.username
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: '60m' });
            return res.json({ success: true, token, userId: user._id });
        }
        return res.status(401).json({ message: 'Invalid password' });
    }
    catch (error) {
        console.error(`Error during user login: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/api/users', validateToken_1.validateToken, async (req, res) => {
    try {
        console.log(req.user);
        const loggedUser = await User_1.User.findById(req.user._id);
        const users = await User_1.User.find({
            $and: [
                { _id: { $ne: loggedUser?._id } },
                { _id: { $nin: loggedUser?.usersLiked } },
                { _id: { $nin: loggedUser?.matches } }
            ]
        }).select('-password -email -timeCreated -matches');
        return res.json(users);
    }
    catch (error) {
        console.error(`Error during fetching users: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/api/users/:id', validateToken_1.validateToken, async (req, res) => {
    const user = await User_1.User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return (res.json(user));
});
router.patch('/api/users/:id', validateToken_1.validateToken, async (req, res) => {
    try {
        console.log(req.params.id, req.body);
        const user = await User_1.User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (req.body.usersLiked) {
            user.usersLiked.push(req.body.usersLiked);
        }
        if (req.body.matches) {
            const likedUser = await User_1.User.findById(req.body.matches);
            likedUser?.matches.push(req.params.id);
            user.matches.push(req.body.matches);
            await likedUser?.save();
        }
        if (req.body.username || req.body.pc || req.body.xbox || req.body.playstation || req.body.genres || req.body.freeText) {
            user.username = req.body.username || user.username;
            user.pc = req.body.pc;
            user.xbox = req.body.xbox;
            user.playstation = req.body.playstation;
            user.genres = req.body.genres || user.genres;
            user.freeText = req.body.freeText || user.freeText;
        }
        await user.save();
        return res.json({ message: 'User updated successfully' });
    }
    catch (error) {
        console.error(`Error during updating user: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/api/chat', validateToken_1.validateToken, async (req, res) => {
    try {
        await ChatSession_1.ChatSession.create({
            user1: req.body.user1,
            user2: req.body.user2,
            messages: []
        });
        return res.status(201).json({ message: 'Chat session created successfully' });
    }
    catch (error) {
        console.error(`Error during chat session creation: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/api/chat', validateToken_1.validateToken, async (req, res) => {
    try {
        const chatSessions = await ChatSession_1.ChatSession.find({
            $or: [
                { user1: req.user._id },
                { user2: req.user._id }
            ]
        });
        return res.json(chatSessions);
    }
    catch (error) {
        console.error(`Error during fetching chat sessions: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/api/chat/messages', validateToken_1.validateToken, async (req, res) => {
    try {
        const chatSession = await ChatSession_1.ChatSession.findById(req.body.chatId);
        if (!chatSession) {
            return res.status(404).json({ message: 'Chat session not found' });
        }
        chatSession.messages.push({
            senderId: req.body.senderId,
            message: req.body.message,
            timestamp: req.body.timestamp
        });
        await chatSession.save();
        return res.json({ message: 'Message sent successfully' });
    }
    catch (error) {
        console.error(`Error during sending message: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/api/chat/messages/:id', validateToken_1.validateToken, async (req, res) => {
    try {
        const chatSession = await ChatSession_1.ChatSession.findById(req.params.id);
        if (!chatSession) {
            return res.status(404).json({ message: 'Chat session not found' });
        }
        return res.json(chatSession.messages);
    }
    catch (error) {
        console.error(`Error during fetching messages: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
