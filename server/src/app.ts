import express, { Express } from "express"
import mongoose, { Connection } from "mongoose"
import dotenv from "dotenv"
import cors, { CorsOptions } from "cors"
import routes from "./routes"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 3000
const mongoDB: string = 'mongodb://127.0.0.1:27017/testdb'
const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))

mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error'))

app.use('/', routes)

app.listen(port, () => { console.log(`App is running on port ${port}`) })

export default app