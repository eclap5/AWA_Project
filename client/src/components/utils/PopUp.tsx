import React, { useEffect, useState } from "react"
import Popup from "reactjs-popup"
import { Button } from "@mui/material"
import { Link } from "react-router-dom"
import "reactjs-popup/dist/index.css"

interface PopUpProps {
    username: string
    open: boolean
}

const PopUp: React.FC<PopUpProps> = ({username, open}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        setIsOpen(open)
    }, [open])

    return (
        <Popup open={isOpen} onClose={() => setIsOpen(false)} position="right center">
            <div>
                <h1>You got a new match with {username}!</h1>
                <Button component={Link} to='/chat'>Chat</Button>
                <Button onClick={() => setIsOpen(false)}>Close</Button>
            </div>
        </Popup>
  )
}

export default PopUp
