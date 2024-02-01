"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsers = void 0;
const User_1 = require("../models/User");
const generateUsers = async () => {
    let i = 10;
    for (i; i > 0; i--) {
        await User_1.User.create({
            email: `test${i}@mail.com`,
            password: 'Foobar123!',
            username: `test${i}`,
            pc: true,
            xbox: false,
            playstation: false,
            genres: ['Action', 'Adventure'],
            freeText: 'I am a test user',
            usersLiked: [],
            matches: [],
            timeCreated: new Date()
        });
    }
};
exports.generateUsers = generateUsers;
