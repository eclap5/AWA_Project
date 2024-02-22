import React from "react"
import Popup from "reactjs-popup"
import { Button } from "@mui/material"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import "reactjs-popup/dist/index.css"

interface PopUpProps {
    username: string | undefined
    open: boolean
    onClose: () => void
}

const PopUp: React.FC<PopUpProps> = ({username, open, onClose}) => {
    const { t } = useTranslation()

    return (
        <Popup open={open} onClose={onClose} position="right center" overlayStyle={{color: 'white'}} contentStyle={{ backgroundColor: '#333', borderRadius: 5, textAlign: 'center'}}>
            <div>
                <h1>{t('You got a new match with')} {username}!</h1>
                <Button sx={{color: 'white', '&:hover': {color: 'black', backgroundColor: 'lightgray'} }} component={Link} to='/chat'>{t('Chat')}</Button>
                <Button sx={{color: 'white', '&:hover': {color: 'black', backgroundColor: 'lightgray'} }} onClick={onClose}>{t('Close')}</Button>
            </div>
        </Popup>
  )
}

export default PopUp
