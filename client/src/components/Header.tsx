import { AppBar, Box, Button, IconButton, MenuItem, Toolbar, Typography, Menu } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import backgroundImg from "../assets/background.jpg"

function Header() {
  useEffect(() => {
    document.body.style.background = `url(${backgroundImg}) no-repeat center center fixed`
    document.body.style.backgroundSize = 'cover'

    if (localStorage.getItem('token')) {
      setIsLoggedIn(true)
    }
  }, [])

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  // const { t, i18n } = useTranslation()
  // const changeLanguage = (lang) => {
  //   i18n.changeLanguage(lang)
  // }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/Login'
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '' }}>
        <Toolbar>
          {!isLoggedIn ? (
            <>
              <Button component={Link} to='/login' color="inherit">Login</Button>
              <Button component={Link} to='/register' color="inherit">Register</Button>
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
              onClose={handleClose}
              onClick={handleClose}
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
              <MenuItem component={Link} to='/dashboard'>Dashboard</MenuItem>
              <MenuItem component={Link} to='/profile'>Profile</MenuItem>
              <MenuItem component={Link} to='/chat'>Chat</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GamerMatcher
          </Typography>
          <Button id='fi' color='inherit'>FI</Button>
          <Button id='en' color='inherit'>EN</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header