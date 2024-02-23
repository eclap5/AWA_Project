import React, { useEffect, useState } from "react"
import { TextField, ThemeProvider, Button } from "@mui/material"
import CheckboxInput from "./utils/CheckboxInput"
import GenreSelection from "./utils/GenreSelection"
import FormInput from "./utils/FormInput"
import theme from "./themes/MaterialTheme"
import "./styles/Register.css"
import { genreOptions } from "../constants/genres"
import { useTranslation } from "react-i18next"

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

const Register = () => {
    useEffect(() => {
        document.title = 'Register'
    }, [])

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [pc, setPc] = useState<boolean>(false)
    const [xbox, setXbox] = useState<boolean>(false)
    const [playstation, setPlaystation] = useState<boolean>(false)
    const [genres, setGenres] = useState<string[]>([])
    const [freeText, setFreeText] = useState<string>('')
    const [error, setError] = useState<string>('')

    const { t } = useTranslation()

    // Form submission creates a new user based on the User interface and sends it to the server
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

        const fetchUser = async (user: User) => {
            try {
                const response = await fetch('http://localhost:3000/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                })

                if (response.status === 401) {
                    setError('Email is already in use')
                    return
                }

                if (response.status === 400) {
                    setError('Password is not strong enough')
                    return
                }

                const data = await response.json()
                console.log(data)

                window.location.href = '/login'
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(`Error when trying to register: ${error.message}`)
                }
            }
        }
        fetchUser(newUser)
    }

    return (
        <div className="container">
            <h2>{t('Create a profile')}</h2>
            <div className="content">
                <form onSubmit={handleSubmit}>
                <ThemeProvider theme={theme}>
                    <div className="form-group">
                        <FormInput label={t('username')} type='text' required={true} value={username} setValue={setUsername} />
                    </div>
                    <div className="form-group">
                        <FormInput label={t('email')} type='email' required={true} value={email} setValue={setEmail} />
                    </div>
                    <div className="form-group">
                        <FormInput label={t('password')} type='password' required={true} value={password} setValue={setPassword} />
                    </div>
                    <div className="checkbox-group">
                        <CheckboxInput label='PC' setChecked={setPc} />
                        <CheckboxInput label='Xbox' setChecked={setXbox} />
                        <CheckboxInput label='Playstation' setChecked={setPlaystation} />
                    </div>
                    <div className="form-group">
                        <GenreSelection genreOptions={genreOptions} genres={genres} setValue={setGenres} />
                    </div>
                    <div className="form-group">
                        <TextField multiline maxRows={3} inputProps={{ style: {color: 'white'} }} onChange={(event) => {setFreeText(event.target.value)}} label={t('description')} />
                    </div>
                    <div style={{ color: 'red' }}>
                        <p>{error}</p>
                    </div>
                    <div className="form-group">
                        <Button type="submit" variant="contained" sx={{color: 'white', border: '1px solid white', background: '#424242', '&:hover': {background: 'lightgray', color: 'black', border: '1px solid white'}}}>{t('Register')}</Button>
                    </div>
                </ThemeProvider>
                </form>
            </div>
        </div>
    )
}

export default Register

