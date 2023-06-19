import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import AuthPage from './pages/AuthPage'
import Forgot from './components/Forgot'
import PasswordOTP from './components/PasswordOTP'
import ResetPassword from './components/ResetPassword'
import Home from './pages/Home'
import TaskCard from './components/TaskCard'
import FirstLogin from './pages/FirstLogin'
import axios from 'axios'

import TaskList from './components/TaskList'
import CreateTask from './components/CreateTask'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './components/Dashboard'
import Account from './components/Account'
import './App.css'
import 'react-quill/dist/quill.snow.css'
// axios.defaults.baseURL='http://172.30.6.96:3500/api'
axios.defaults.baseURL='http://localhost:3500/api'
function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/auth' element={<AuthPage/>}>
        <Route path='forgot' element={<Forgot/>}/>
        <Route path='checkotp/:resetToken' element={<PasswordOTP/>}/>
        <Route path='reset/:resetToken' element={<ResetPassword/>}/>
      </Route>
      <Route path='/first' element={<FirstLogin/>}/>
      <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}>
        <Route path='dashboard' element={<Dashboard/>}/>
        <Route path="tasks" element={<TaskList/>}/>
        <Route path="tasks/:taskId" element={<TaskCard/>}/>
        <Route path="create" element={<CreateTask/>}/>
        <Route path='account' element={<Account/>}/>
      </Route>
    </Routes>
  )
}

export default App
