import { useEffect, useState } from "react"
import landingBg from '../assets/landing-bg.svg'
import axios from 'axios'
import {toast} from 'react-toastify'
import { useNavigate,NavLink } from "react-router-dom"
import {AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai'
import Loader from '../components/Loader'
import fetchUser from "../utils/fetchUser"
axios.defaults.baseURL='http://localhost:3500/api'

const Landing = () => {
  const user=fetchUser()
  const navigate=useNavigate()
  const [isLoading,setIsLoading]=useState(false)
  const [userData,setUserData]=useState(null)
  const [showPassword,setShowPassword]=useState(false)
  const [credentials,setCredentials]=useState({
    input:'',
    password:''
  })
  const loginUser=async(creds)=>{
    try{
      setIsLoading(true)
      const res=await axios.post('/auth/login',creds)
      setUserData(res.data)
      toast.success(`Welcome ${res.data?.data?.name}`)
      localStorage.setItem('user',JSON.stringify(res.data))
      navigate('/dashboard')
    }catch(err){
      toast.error(err.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }
  const handleChange=(e)=>{
    const {name,value}=e.target;
    setCredentials((prev)=>({
        ...prev,
        [name]:value
    }))
  }
  const handleSubmit=async(e)=>{
    e.preventDefault()
    if (!(credentials.input && credentials.password)){
        return toast.error('All inputs must be filled.')
    }
    await loginUser(credentials)
    setCredentials({input:'',password:''})
  }
  const togglePassword=()=>{
    setShowPassword((prev)=>!prev)
  }
  useEffect(()=>{
    if(localStorage.getItem('user')){
      localStorage.clear()
    }
  })
  return (
    <div className="container">
      <Loader isLoading={isLoading}/>
      <img src={landingBg} className='landing_bg'/>
      <div className="layout">
        <nav className='layout__nav'>
          <NavLink to={'/'} className="nav__title__landing">Taski<span className='title__blue'>Fy</span></NavLink>
          <div className='nav__menu'>
            <NavLink className='nav__menu__link' disabled>Contact</NavLink>
            <NavLink to={'/'} className='nav__menu__link'>Login</NavLink>
            <NavLink className='nav__menu__link' disabled>Register</NavLink>
          </div>
        </nav>
        <div className="layout__title">
          <p className='main__title'>Taski<span className='title__blue'>Fy</span></p>
          <p className='custom__text'>Task Management System for</p> 
          <p className='custom__text__company'>Radico Khaitan <span className='title__blue'>Ltd.</span></p>
        </div>
        <div className='layout__form'>
          <form className="landing__form">
            <div className="text__container">
              <input
               type="text"
               placeholder='Employee code or Email address'
               value={credentials.input}
               onChange={handleChange}
               name='input'
               autoComplete="off"
               required />
            </div>
            <div className="landing__pwd__container">
              <input
               type={showPassword ? 'text':'password'}
               placeholder='Password'
               value={credentials.password}
               onChange={handleChange}
               name='password'
               required/>
               {showPassword ? <AiOutlineEyeInvisible className="pwd_icon" onClick={togglePassword} size={28}/>:<AiOutlineEye className="pwd_icon" onClick={togglePassword} size={28}/>}
            </div>
            <button onClick={handleSubmit} className='blue__btn'><h2>Login</h2></button>
            <p className="forgot-p" onClick={()=>navigate('/auth/forgot')}>Forgotten password?</p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Landing;