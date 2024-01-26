import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/register' element = {<> <Header /> <Register /> </>} />
          <Route path='/login' element = {<> <Header /> <Login /> </>} />
          <Route path='/dashboard' element = {<> <Header /> <Dashboard /> </>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App