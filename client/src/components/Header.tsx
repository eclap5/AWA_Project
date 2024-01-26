import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import backgroundImg from "../assets/background.jpg"


function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  // const { t, i18n } = useTranslation()
  // const changeLanguage = (lang) => {
  //   i18n.changeLanguage(lang)
  // }
  
  useEffect(() => {
    document.body.style.background = `url(${backgroundImg}) no-repeat center center fixed`
    document.body.style.backgroundSize = 'cover'

    if (localStorage.getItem('token')) {
      setIsLoggedIn(true)
    }
  }, [])

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
              <Button component={Link} to='/dashboard' color="inherit">Dashboard</Button>
              <Button onClick={handleLogout} color="inherit">Logout</Button>
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