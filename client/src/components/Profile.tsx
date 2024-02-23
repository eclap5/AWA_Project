import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TextField, Button, ThemeProvider } from '@mui/material'
import CheckboxInput from './utils/CheckboxInput'
import GenreSelect from './utils/GenreSelection'
import FormInput from './utils/FormInput'
import theme from './themes/MaterialTheme'
import { genreOptions } from '../constants/genres'
import './styles/profile.css'

function Profile() {
    useEffect(() => {
        document.title = 'Edit profile'
        fetchUser()
    }, [])

    const [username, setUsername] = useState<string>('')
    const [pc, setPc] = useState<boolean>(false)
    const [xbox, setXbox] = useState<boolean>(false)
    const [playstation, setPlaystation] = useState<boolean>(false)
    const [genres, setGenres] = useState<string[]>([])
    const [freeText, setFreeText] = useState<string>('')
    const [ savedText, setSavedText ] = useState<string>('')

    const { t } = useTranslation()

    // Fetch user data from the server and set the values to the state variables to show default values in the form
    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${localStorage.getItem('user_id')}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 403) {
                localStorage.removeItem('token')
                localStorage.removeItem('user_id')
                window.location.href = '/login'
            }

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }
            const data = await response.json()

            setUsername(data.username)
            setPc(data.pc)
            setXbox(data.xbox)
            setPlaystation(data.playstation)
            setGenres(data.genres)
            setFreeText(data.freeText)
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(`Error when trying to fetch user: ${error.message}`)
            }
        }
    }

    // Send the updated user data to the server
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        console.log(username, pc, xbox, playstation, genres, freeText)
        await fetch(`http://localhost:3000/api/users/${localStorage.getItem('user_id')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({username, pc, xbox, playstation, genres, freeText})
        })
        fetchUser()
        setSavedText(t('Profile updated'))
    }

    return (
        <div className="container">
            <h2>{t('Edit profile')}</h2>
            <div className="content">
                <form onSubmit={handleSubmit}>
                <ThemeProvider theme={theme}>
                    <div className="form-group">
                        <FormInput label={t('username')} type='text' value={username} setValue={setUsername} defaultValue={username} />
                    </div>
                    <div className="checkbox-group">
                        <CheckboxInput label='PC' setChecked={setPc} isChecked={pc} />
                        <CheckboxInput label='Xbox' setChecked={setXbox} isChecked={xbox} />
                        <CheckboxInput label='Playstation' setChecked={setPlaystation} isChecked={playstation} />
                    </div>
                    <div className="form-group">
                        <GenreSelect genreOptions={genreOptions} genres={genres} setValue={setGenres} />
                    </div>
                    <div className="form-group">
                        <TextField multiline maxRows={3} inputProps={{ style: {color: 'white'} }} onChange={(event) => {setFreeText(event.target.value)}} label={t('description')} defaultValue={freeText} InputLabelProps={{ shrink: !!freeText }} />
                    </div>
                    <div>
                        <p style={{ color: '#7CFC00' }}>{savedText}</p>
                    </div>
                    <div className="form-group">
                        <Button type="submit" variant="contained" sx={{color: 'white', border: '1px solid white', background: '#424242', '&:hover': {background: 'grey', border: '1px solid white'}}}>{t('Save')}</Button>
                    </div>
                </ThemeProvider>
                </form>
            </div>
        </div>
    )
}

export default Profile