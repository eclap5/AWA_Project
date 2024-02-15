import React, { useEffect, useState } from 'react'
import CheckboxInput from './utils/CheckboxInput'
import GenreSelect from './utils/GenreSelection'
import FormInput from './utils/FormInput'
import theme from './utils/MaterialTheme'
import { TextField, Button, ThemeProvider } from '@mui/material'

function Profile() {
    useEffect(() => {
        document.title = 'Edit profile'
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${localStorage.getItem('user_id')}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

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
                console.log(`Error when trying to get user: ${error.message}`)
            }
        }
    }

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

    const [username, setUsername] = useState<string>('')
    const [pc, setPc] = useState<boolean>(false)
    const [xbox, setXbox] = useState<boolean>(false)
    const [playstation, setPlaystation] = useState<boolean>(false)
    const [genres, setGenres] = useState<string[]>([])
    const [freeText, setFreeText] = useState<string>('')

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        await fetch(`http://localhost:3000/api/users/${localStorage.getItem('user_id')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({username, pc, xbox, playstation, genres, freeText})
        })
        fetchUser()
    }

    return (
        <div className="container">
            <h2>Edit profile</h2>
            <div className="content">
                <form onSubmit={handleSubmit}>
                <ThemeProvider theme={theme}>
                    <div className="form-group">
                        <FormInput label='username' type='text' value={username} setValue={setUsername} defaultValue={username} />
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
                        <TextField multiline maxRows={3} inputProps={{ style: {color: 'white'} }} onChange={(event) => {setFreeText(event.target.value)}} label='Description' defaultValue={freeText} InputLabelProps={{ shrink: !!freeText }} />
                    </div>
                    <div className="form-group">
                        <Button type="submit" variant="contained" sx={{color: 'white', border: '1px solid white', background: '#424242', '&:hover': {background: 'grey', border: '1px solid white'}}}>save</Button>
                    </div>
                </ThemeProvider>
                </form>
            </div>
        </div>
    )
}

export default Profile