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
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({ message: 'this is index page' });
});
router.post('/api/users/register', async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const existingUser = await User_1.User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(403).json({ email: 'Email already in use.' });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        console.log(req.body);
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
            return res.status(403).json({ message: 'Login failed' });
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
        const users = await User_1.User.find().select('-password -email -timeCreated -matches');
        console.log(users);
        return res.json(users);
    }
    catch (error) {
        console.error(`Error during fetching users: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.patch('/api/users/:id', validateToken_1.validateToken, async (req, res) => {
    try {
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
        }
        await user.save();
        return res.json({ message: 'User updated successfully' });
    }
    catch (error) {
        console.error(`Error during updating user: ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
