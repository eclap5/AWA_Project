import mongoose, { Document, Schema } from "mongoose"

interface IUser extends Document {
    username: string
    email: string
    password: string
    pc: boolean
    xbox: boolean
    playstation: boolean
    genres: string[]
    freeText: string
    usersLiked: string[]
    matches: string[]
    timeCreated: Date
}

let userSchema: Schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    pc: { type: Boolean, required: false },
    xbox: { type: Boolean, required: false },
    playstation: { type: Boolean, required: false },
    genres: { type: [String], required: false },
    freeText: { type: String, required: false },
    usersLiked: { type: [String], required: true },
    matches: { type: [String], required: true },
    timeCreated: { type: Date, required: true }
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>('User', userSchema)

export { User, IUser }