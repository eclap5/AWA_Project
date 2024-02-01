import { User } from "../models/User"

const generateUsers = async () => {
    let i: number = 10

    for (i; i > 0; i--) {
        await User.create({
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
        })
    }
}

export { generateUsers }
