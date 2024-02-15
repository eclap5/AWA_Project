import React, { useEffect, useState } from "react"
import { TextField, ThemeProvider, Button } from "@mui/material"
import CheckboxInput from "./utils/CheckboxInput"
import GenreSelection from "./utils/GenreSelection"
import FormInput from "./utils/FormInput"
import theme from "./utils/MaterialTheme"
import "./styles/Register.css"
import backgroundImg from "../assets/background.jpg"

const Register = () => {
    useEffect(() => {
        document.title = 'Register'
        document.body.style.background = `url(${backgroundImg}) no-repeat center center fixed`
        document.body.style.backgroundSize = 'cover'
    }, [])

    interface User {
        username: string
        email: string
        password: string
        pc: boolean
        xbox: boolean
        playstation: boolean
        genres: string[]
        freeText: string
    }

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [pc, setPc] = useState<boolean>(false)
    const [xbox, setXbox] = useState<boolean>(false)
    const [playstation, setPlaystation] = useState<boolean>(false)
    const [genres, setGenres] = useState<string[]>([])
    const [freeText, setFreeText] = useState<string>('')

    // Todo: tää jonnekkin muualle
    const genreOptions: string[] = [
    'Action',
    'Adventure',
    'RPG',
    'Strategy',
    'Simulation',
    'Sports',
    'Racing',
    'MMO',
    'Puzzle',
    'FPS',
    'Horror'
    ]

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        const newUser: User = {
            username,
            email,
            password,
            pc,
            xbox,
            playstation,
            genres,
            freeText
        }
        console.log(newUser)

        const fetchUser = async (user: User) => {
            try {
                const response = await fetch('http://localhost:3000/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                })

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`)
                }
                const data = await response.json()
                console.log(data)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(`Error when trying to register: ${error.message}`)
                }
            }
        }

        fetchUser(newUser)
        window.location.href = '/login'
    }

    return (
        <div className="container">
            <h2>Create a profile</h2>
            <div className="content">
                <form onSubmit={handleSubmit}>
                <ThemeProvider theme={theme}>
                    <div className="form-group">
                        <FormInput label='username' type='text' required={true} value={username} setValue={setUsername} />
                    </div>
                    <div className="form-group">
                        <FormInput label='email' type='email' required={true} value={email} setValue={setEmail} />
                    </div>
                    <div className="form-group">
                        <FormInput label='password' type='password' required={true} value={password} setValue={setPassword} />
                    </div>
                    <div className="checkbox-group">
                        <CheckboxInput label='PC' setChecked={setPc} isChecked={false} />
                        <CheckboxInput label='Xbox' setChecked={setXbox} isChecked={false} />
                        <CheckboxInput label='Playstation' setChecked={setPlaystation} isChecked={false} />
                    </div>
                    <div className="form-group">
                        <GenreSelection genreOptions={genreOptions} genres={genres} setValue={setGenres} />
                    </div>
                    <div className="form-group">
                        <TextField multiline maxRows={3} inputProps={{ style: {color: 'white'} }} onChange={(event) => {setFreeText(event.target.value)}} label='Description' />
                    </div>
                    <div className="form-group">
                        <Button type="submit" variant="contained" sx={{color: 'white', border: '1px solid white', background: '#424242', '&:hover': {background: 'grey', border: '1px solid white'}}}>Register</Button>
                    </div>
                </ThemeProvider>
                </form>
            </div>
        </div>
    )
}

export default Register

