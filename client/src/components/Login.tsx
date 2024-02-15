import React, { useEffect, useState } from "react"
import { ThemeProvider, Button } from "@mui/material"
import FormInput from "./utils/FormInput"
import theme from "./utils/MaterialTheme"
import "./styles/Register.css"

const Login = () => {
    useEffect(() => {
        document.title = 'Login'
    }, [])

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    interface Credentials {
        email: string
        password: string
    }

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

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`)
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
            <h2>Login</h2>
            <div className="content">
                <form onSubmit={handleSubmit}>
                <ThemeProvider theme={theme}>
                    <div className="form-group">
                        <FormInput label='email' type='email' required={true} value={email} setValue={setEmail} />
                    </div>
                    <div className="form-group">
                        <FormInput label='password' type='password' required={true} value={password} setValue={setPassword} />
                    </div>
                    <div className="form-group">
                        <Button type="submit" variant="contained" sx={{color: 'white', border: '1px solid white', background: '#424242', '&:hover': {background: 'grey', border: '1px solid white'}}}>Login</Button>
                    </div>
                </ThemeProvider>
                </form>
            </div>
        </div>
    )
}

export default Login

