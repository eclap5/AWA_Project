import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Chat from './components/Chat'
import Profile from './components/Profile'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element = {<> <Header /> <Dashboard /> </>} />
          <Route path='/register' element = {<> <Header /> <Register /> </>} />
          <Route path='/login' element = {<> <Header /> <Login /> </>} />
          <Route path='/dashboard' element = {<> <Header /> <Dashboard /> </>} />
          <Route path='/chat' element = {<> <Header /> <Chat /> </>} />
          <Route path='/profile' element = {<> <Header /> <Profile /> </>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
