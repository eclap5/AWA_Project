import TinderCard from "react-tinder-card"
import { useState, useEffect } from "react"
import theme from "./utils/MaterialTheme"
import { ThemeProvider } from "@emotion/react"
import PopUp from "./utils/PopUp"
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

    const [users, setUsers] = useState<User[]>(null!)
    const [userIndex, setUserIndex] = useState<number>(0)
    const [userId, setUserId] = useState<string>('')

    useEffect(() => {
        document.title = 'Dashboard'
        setUserId(localStorage.getItem('user_id')!)
        fetchUsers()
    }, [])

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
            setUsers(data)
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(`Error when trying to get users: ${error.message}`)
            }
        }
    }

    const updateUser = async (endpoint: string, user: User) => {
        await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({[endpoint]: user._id})
        })
    }

    const increaseUserIndex = () => {
        if (users && userIndex + 1 <= users.length)
            setUserIndex((prevIndex) => (prevIndex + 1 < (users ? users.length + 1 : 0) ? prevIndex + 1 : prevIndex))
    }

    const swiped = (direction: string, user: User) => {
        console.log(userIndex, users)
        if (direction === 'right') {
            increaseUserIndex()
            console.log('You liked ' + user.username)
            
            if (user.usersLiked.includes(userId)) {
                console.log('Match!')
                updateUser('matches', user)
            } else {
                updateUser('usersLiked', user)
            }
        } else if (direction === 'left') {
            increaseUserIndex()
            console.log('You disliked ' + user.username)
            setUsers(users.filter((u) => u.username !== user.username))
        }
    }

    return (
        <div className="cardContainer">
            {users && users.length > 0 && userIndex <= users.length && (
                <TinderCard key={userIndex} onSwipe={(direction) => swiped(direction, users[userIndex])} preventSwipe={['up', 'down']}>
                    <PopUp username={users[userIndex].username} open={users[userIndex].usersLiked.includes(userId)} />
                    <ThemeProvider theme={theme}>
                        <div className="card">
                            <h2>{users[userIndex].username}</h2>
                            <p>PC: {users[userIndex].pc ? 'Yes' : 'No'}</p>
                            <p>PlayStation: {users[userIndex].playstation ? 'Yes' : 'No'}</p>
                            <p>Xbox: {users[userIndex].xbox ? 'Yes' : 'No'}</p>
                            <p>Genres: {users[userIndex].genres.join(', ')}</p>
                            <p>{users[userIndex].freeText}</p>
                        </div>
                    </ThemeProvider>
                </TinderCard> )}
                {(users && users.length === 0) || (users && users.length > 0 && userIndex === users.length) && (
                    <TinderCard preventSwipe={['left', 'right', 'up', 'down']}>
                    <ThemeProvider theme={theme}>
                        <div className="card">
                            <h2>No more players to show. <br /> Come back later.</h2>
                        </div>
                    </ThemeProvider>
                </TinderCard>
                )}
        </div>
    )
}

export default Dashboard