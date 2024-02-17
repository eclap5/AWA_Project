import { AppBar, Box, Button, IconButton, MenuItem, Toolbar, Typography, Menu } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import backgroundImg from "../assets/background.jpg"

function Header() {
  useEffect(() => {
    document.body.style.background = `url(${backgroundImg}) no-repeat center center fixed`
    document.body.style.backgroundSize = 'cover'

    if (localStorage.getItem('token')) {
      setIsLoggedIn(true)
    }
  }, [])

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  
  const open: boolean = Boolean(anchorEl)

  const { t, i18n } = useTranslation()
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    window.location.href = '/login'
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#333' }}>
        <Toolbar>
          {!isLoggedIn ? (
            <>
              <Button sx={{ '&:hover': {color: 'black', backgroundColor: 'lightgray'} }} component={Link} to='/login' color="inherit">{t('Login')}</Button>
              <Button sx={{ '&:hover': {color: 'black', backgroundColor: 'lightgray'} }} component={Link} to='/register' color="inherit">{t('Register')}</Button>
            </>
          ): (
            <>
              <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => {setAnchorEl(null)}}
              onClick={() => {setAnchorEl(null)}}
              sx={{
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem sx={{ '&:hover': {color: 'black', backgroundColor: 'lightgray'} }} component={Link} to='/dashboard'>{t('Dashboard')}</MenuItem>
              <MenuItem sx={{ '&:hover': {color: 'black', backgroundColor: 'lightgray'} }} component={Link} to='/profile'>{t('Profile')}</MenuItem>
              <MenuItem sx={{ '&:hover': {color: 'black', backgroundColor: 'lightgray'} }} component={Link} to='/chat'>{t('Chat')}</MenuItem>
              <MenuItem sx={{ '&:hover': {color: 'black', backgroundColor: 'lightgray'} }} onClick={handleLogout}>{t('Logout')}</MenuItem>
            </Menu>
          </>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GamerMatcher
          </Typography>
          <Button sx={{ '&:hover': {color: 'black', backgroundColor: 'lightgray'} }} id='fi' color='inherit' onClick={() => {changeLanguage('fi')}}>FI</Button>
          <Button sx={{ '&:hover': {color: 'black', backgroundColor: 'lightgray'} }} id='en' color='inherit' onClick={() => {changeLanguage('en')}}>EN</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header