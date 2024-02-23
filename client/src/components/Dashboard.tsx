import TinderCard from "react-tinder-card"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import theme from "./themes/MaterialTheme"
import { ThemeProvider } from "@emotion/react"
import PopUp from "./utils/PopUp"
import "./styles/Dashboard.css"

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

function Dashboard() {
    const [users, setUsers] = useState<User[]>(null!)
    const [userIndex, setUserIndex] = useState<number>(0)
    const [userId, setUserId] = useState<string>('')
    const [isMatch, setIsMatch] = useState<boolean>(false)
    const [hasSwiped, setHasSwiped] = useState<boolean>(false)
    const [currentUser, setCurrentUser] = useState<User | null>(null)

    const { t } = useTranslation()

    // Fetch all users from the server when page is loaded
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

            if (response.status === 403) {
                localStorage.removeItem('token')
                localStorage.removeItem('user_id')
                window.location.href = '/login'
            }

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

    // Update the user document in the database with the new match or liked user
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

    // Create a new chat session with the matched user
    const createChatSession = async (user: User) => {
        await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({user1: userId, user2: user._id})
        })
    }

    // Increase the index to show the next user in the list
    const increaseUserIndex = () => {
        if (users && userIndex + 1 <= users.length)
            setUserIndex((prevIndex) => (prevIndex + 1 < (users ? users.length + 1 : 0) ? prevIndex + 1 : prevIndex))
    }

    // When a user swipes a card, the user is removed from the list and the user document is updated in the database based on the swipe direction
    const swiped = (direction: string, user: User) => {
        console.log(userIndex, users)
        setHasSwiped(true)
        if (direction === 'right') {
            console.log('You liked ' + user.username)
            setCurrentUser(user)
            
            if (user.usersLiked.includes(userId)) {
                console.log('Match!')

                updateUser('matches', user)
                createChatSession(user)
                setIsMatch(true)
            } else {
                updateUser('usersLiked', user)
            }
        } else if (direction === 'left') {
            console.log('You disliked ' + user.username)
            setUsers(users.filter((u) => u.username !== user.username))
        }
        increaseUserIndex()
    }

    return (
        <div className="cardContainer">
            {users && users.length > 0 && userIndex < users.length && (
                <TinderCard 
                    key={userIndex} 
                    onSwipe={(direction) => swiped(direction, users[userIndex])}
                    preventSwipe={['up', 'down']}
                >
                    <PopUp 
                        username={currentUser?.username} 
                        open={isMatch && hasSwiped} 
                        onClose={() => { setIsMatch(false); setHasSwiped(false) }}
                    />
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
                {((users && users.length === 0) || (users && users.length > 0 && userIndex === users.length)) && (
                    <TinderCard preventSwipe={['left', 'right', 'up', 'down']}>
                    <ThemeProvider theme={theme}>
                        <div className="card">
                            <h2>{t('No more players to show.')} <br /> {t('Come back later.')}</h2>
                        </div>
                    </ThemeProvider>
                </TinderCard>
            )}
        </div>
    )
}

export default Dashboard