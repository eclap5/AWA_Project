import { List, ListItemText, Typography, Divider, ListItemButton } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import ChatMessages from "./utils/ChatMessages"

function Chat() {

    const [userChats, setUserChats] = useState<ChatSession[] | null>(null)
    const [loggedUserId] = useState<string | null>(localStorage.getItem('user_id'))
    const [usernames, setUsername] = useState<Record<string, string>>({})
    const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null)

    const { t } = useTranslation()

    type Message = {
        message: string
        senderId: string
        timestamp: Date
    }

    interface ChatSession {
        user1: string
        user2: string
        messages: Message[]
        _id: string
    }

    useEffect(() => {
        document.title = 'Chat'
        fetchChats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchChats = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/chat', {
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
            setUserChats(data)
            fetchUsernames(data)
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(`Error when trying to get chats: ${error.message}`)
            }
        }
    }
 
    const fetchUsernames = async (chats: ChatSession[]) => {
        try {
            const promises = chats.map(async (chat) => {
                let userId: string
                if (chat.user1 === loggedUserId) {
                    userId = chat.user2
                } else {
                    userId = chat.user1
                }
                const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
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
                return { [userId]: data.username }
            })
            const resolvedPromises = await Promise.all(promises)
            const mergedUsernames = Object.assign({}, ...resolvedPromises)

            setUsername(mergedUsernames)
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(`Error when trying to get username: ${error.message}`)
            }
        }
    }

    const openChat = (chat: ChatSession) => {
        setSelectedChat(chat)
        console.log(selectedChat)
    }

    const latestMessage = (chat: ChatSession) => {
        if (chat.messages.length > 0) {
            const msg: string = chat.messages[chat.messages.length - 1].message
            const senderId: string = chat.messages[chat.messages.length - 1].senderId
            if (senderId === loggedUserId) {
                return t('You') + ': ' + msg
            } 
            return usernames[chat.messages[chat.messages.length - 1].senderId] + ': ' + msg  
        }
        return 'No messages'
    }

    return (
        <>
            <div style={{ margin: '2%' }}>
                <p style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', marginBottom: '4px' }} >{t('Messages')}</p>
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <List sx={{ width: '100%', maxWidth: 300, bgcolor: '#333', borderRadius: '15px', border: '1px solid white', padding: '0', overflow: 'auto', '::-webkit-scrollbar': {width: '8px'} }}>
                        {userChats?.map((chat) => (
                            <React.Fragment key={chat._id}>
                                <ListItemButton onClick={() => openChat(chat)} alignItems="flex-start" sx={{ paddingTop: '0', paddingBottom: '0' }}>
                                    <ListItemText
                                    primary={
                                        <>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body1"
                                            color="white"
                                        >
                                            {usernames[chat.user1 === loggedUserId ? chat.user2 : chat.user1]}
                                        </Typography>
                                        </>
                                    }
                                    secondary={
                                        <>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="gray"
                                        >
                                            {latestMessage(chat)}
                                        </Typography>
                                        </>
                                    }
                                    />
                                </ListItemButton>
                                <Divider variant="fullWidth" component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                </div>
                {selectedChat && (
                    <ChatMessages 
                        chat={selectedChat} 
                        loggedUserId={loggedUserId!} 
                        username={usernames[selectedChat.user1 === loggedUserId ? selectedChat.user2 : selectedChat.user1]} 
                    />
                )}
            </div>
        </>
    )
}

export default Chat