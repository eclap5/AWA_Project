import TinderCard from "react-tinder-card"
import { useState, useEffect } from "react"
import theme from "./utils/MaterialTheme"
import { ThemeProvider } from "@emotion/react"
import "./styles/Dashboard.css"

function Dashboard() {
    type User = {
        _id: string
        username: string
        pc: boolean
        playstation: boolean
        xbox: boolean
        genres: string[]
        freeText: string
        usersLiked: string[]
    }

    const [users, setUsers] = useState<User[]>([])
    const [userId, setUserId] = useState<string>('')

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
    
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }
            const data = await response.json()
            console.log(data)
            setUsers(prevUsers => [...prevUsers, ...data])
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(`Error when trying to register: ${error.message}`)
            }
        }
    }

    useEffect(() => {
        document.title = 'Dashboard'
        setUserId(localStorage.getItem('user id')!)
        fetchUsers()
    }, [])

    const updateMatches = async (user: User) => {
        await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({matches: user._id})
        })
    }

    const appendLikedUsers = async (user: User) => {
        await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({usersLiked: user._id})
        })
    }

    useEffect(() => {
        console.log(users)
        if (users.length < 5) {
            fetchUsers()
        }
    }, [users])

    const swiped = (direction: string, user: User) => {
        if (direction === 'right') {
            console.log('You liked ' + user.username)
            
            if (user.usersLiked.includes(userId)) {
                console.log('Match!')
                updateMatches(user)
            } else {
                appendLikedUsers(user)
            }
        } else if (direction === 'left') {
            console.log('You disliked ' + user.username)
            setUsers(users.filter((u) => u.username !== user.username))
        }
    }

    return (
        <div className="cardContainer">
            {users.map((user, index) => (
                <TinderCard key={index} onSwipe={(direction) => swiped(direction, user)}>
                    <ThemeProvider theme={theme}>
                        <div className="card">
                            <h2>{user.username}</h2>
                            <p>PC: {user.pc ? 'Yes' : 'No'}</p>
                            <p>PlayStation: {user.playstation ? 'Yes' : 'No'}</p>
                            <p>Xbox: {user.xbox ? 'Yes' : 'No'}</p>
                            <p>Genres: {user.genres.join(', ')}</p>
                            <p>{user.freeText}</p>
                        </div>
                    </ThemeProvider>
                </TinderCard>
            ))}
        </div>
    )
}

export default Dashboard