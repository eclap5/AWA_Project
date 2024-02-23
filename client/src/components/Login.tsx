import React, { useEffect, useState } from "react"
import { ThemeProvider, Button } from "@mui/material"
import { useTranslation } from "react-i18next"
import FormInput from "./utils/FormInput"
import theme from "./themes/MaterialTheme"
import "./styles/Register.css"
import "./styles/Login.css"

interface Credentials {
    email: string
    password: string
}

const Login = () => {
    useEffect(() => {
        document.title = 'Login'
    }, [])

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')

    const { t } = useTranslation()

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        const credentials: Credentials = {
            email,
            password
        }

        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials)
                })

                if (response.status === 401) {
                    setError('Invalid credentials')
                }

                const data = await response.json()

                if (data.token) {
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('user_id', data.userId)
                    window.location.href = '/dashboard'
                }
                console.log(data)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(`Error when trying to login: ${error.message}`)
                }
            }
        }
        fetchUser()
    }

    return (
        <div className="container">
            <h2>{t('Login')}</h2>
            <div className="content">
                <form onSubmit={handleSubmit}>
                <ThemeProvider theme={theme}>
                    <div className="form-group">
                        <FormInput label={t('email')} type='email' required={true} value={email} setValue={setEmail} />
                    </div>
                    <div className="form-group">
                        <FormInput label={t('password')} type='password' required={true} value={password} setValue={setPassword} />
                    </div>
                    <div style={{color: 'red'}}>
                        {error}
                    </div>
                    <div className="form-group">
                        <Button type="submit" variant="contained" sx={{color: 'white', border: '1px solid white', background: '#424242', '&:hover': {background: 'lightgray', color: 'black', border: '1px solid white'}}}>{t('Login')}</Button>
                    </div>
                </ThemeProvider>
                </form>
            </div>
        </div>
    )
}

export default Login

