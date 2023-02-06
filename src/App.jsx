import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
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
// axios.defaults.baseURL='http://localhost:3500/api'

axios.defaults.baseURL='https://taskify-backend.onrender.com/api';
function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Landing/>}/>
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
