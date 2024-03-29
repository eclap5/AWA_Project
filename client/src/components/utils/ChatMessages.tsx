import React, { useEffect, useRef, useState } from "react"
import { MessageList } from "react-chat-elements"
import { Button } from "@mui/material"
import { useTranslation } from "react-i18next"
import 'react-chat-elements/dist/main.css'
import '../styles/chat.css'

type Message = {
    message: string
    senderId: string
    timestamp: Date
}

interface NewMessage {
    position: string
    type: string
    text: string
    date: Date
    title: string
}

interface ChatSession {
    user1: string
    user2: string
    messages: Message[]
    _id: string
}

interface ChatMessagesProps {
    chat: ChatSession
    loggedUserId: string | null
    username: string
}

const ChatMessages: React.FC<ChatMessagesProps> = ({chat, loggedUserId, username}) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [messages, setMessages] = useState<any[]>([])
    const [message, setMessage] = useState<string>('')
    const messageListReferance: React.RefObject<HTMLElement> = useRef<HTMLDivElement>(null)

    const { t } = useTranslation()

    // When the chat changes, update the messages array
    useEffect(() => {
        const messageArray = chat.messages.map((message: Message) => ({
            position: message.senderId === loggedUserId ? 'right' : 'left',
            type: 'text',
            text: message.message,
            date: message.timestamp,
            title: message.senderId === loggedUserId ? 'You' : username
        }))
        setMessages(messageArray)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat])

    // Scroll to the bottom of the chat when the messages array changes
    useEffect(() => {
        messageListReferance.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [messages])

    // Create a new message and send it to the server
    const sendMessage = async () => {
        console.log('Send message', message)
        if (message.trim() !== '') {
            const newMessage: NewMessage = {
                position: 'right',
                type: 'text',
                text: message,
                date: new Date(),
                title: 'You'
            }
            setMessages(prevMessages => [...prevMessages, newMessage])
            
            try {
                console.log(chat._id, message)
                const response = await fetch('http://localhost:3000/api/chat/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ chatId: chat._id, message: message, senderId: loggedUserId, timestamp: newMessage.date })
                })

                if (response.status === 403) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user_id')
                    window.location.href = '/login'
                }

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`)
                }

                setMessage('')
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(`Error when trying to send message: ${error.message}`)
                }
            }            
        }
    }

    // Fetch all messages from the server
    const getMessages = async () => {
        console.log('Get messages')
        try {
            const response = await fetch(`http://localhost:3000/api/chat/messages/${chat._id}`, {
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

            if (data) {
                console.log(data.messages)
                const messageArray = data.map((message: Message) => ({
                    position: message.senderId === loggedUserId ? 'right' : 'left',
                    type: 'text',
                    text: message.message,
                    date: message.timestamp,
                    title: message.senderId === loggedUserId ? 'You' : username
                }))
                
                setMessages(messageArray)
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(`Error when trying to get messages: ${error.message}`)
            }
        }
    }

    return (
        <>
            <h3>{username}</h3>
            <div className='chat-container'>
                <MessageList
                    referance={messageListReferance}
                    className='message-list'
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={messages}
                />
            </div>
            <div>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} style={{ outline: 'none' }} />
                <Button sx={{margin: '2px', color: 'white', border: '1px solid white', background: '#424242', '&:hover': {background: 'grey', border: '1px solid white'}}} variant='contained' color='primary' onClick={sendMessage}>{t('Send')}</Button>
                <Button sx={{margin: '2px', color: 'white', border: '1px solid white', background: '#424242', '&:hover': {background: 'grey', border: '1px solid white'}}} variant='contained' color='primary' onClick={getMessages}>{t('Refresh')}</Button>
            </div>
        </>
    )
}

export default ChatMessages

