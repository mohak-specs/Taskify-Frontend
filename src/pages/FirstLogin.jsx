import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'
import axios from "axios";
import fetchUser from "../utils/fetchUser";
import Loader from "../components/Loader";
import { FormControl, TextField } from "@mui/material";
import { useTitle } from "../utils/useTitle";
const FirstLogin = () => {
  const navigate=useNavigate()
  const user=fetchUser()
  const {token,data}=user?user:{token:'',data:''}
  const [formData,setFormData]=useState({
    username:data?data?.username:'',
    password:'',
    confirmPassword:''
  })
  const [passwordChanged,setPasswordChanged]=useState(false)
  const [isLoading,setIsLoading]=useState(false)
  const handleChange=(e)=>{
    const {name,value}=e.target
    setFormData((prev)=>({
      ...prev,
      [name]:value
    }))
  }
  const firstReset=async(authToken,data)=>{
    try{
      setIsLoading(true)
      await axios.post('/auth/first',data,{headers:{Authorization: `Bearer ${authToken}`}})
      setPasswordChanged(true)
      toast.success('Password has been changed successfully.')
    }catch(err){
      toast.error(err?.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }
  const handleSubmit=async(e)=>{
    e.preventDefault()
    await firstReset(token,formData)
    setFormData({username:data?data.username:'',password:'',confirmPassword:''})
  }
  useTitle('First Login')
  useEffect(()=>{
    if(!user){
      toast.error('Please login first to perform this action',{
        toastId:'error4'
      })
      // localStorage.clear()
      navigate('/')
    }
    if(user && passwordChanged){
      toast.info('Please login again with your new password.')
      localStorage.clear()
      navigate('/')
    }
  },[passwordChanged])
  return (
    <div className="first__container">
      <div className="first__card">
        <h2>Change your password</h2>
        <form onSubmit={handleSubmit} className="flex-form">
          <FormControl sx={{display:'flex',flexDirection:'column',gap:'8px',marginY:'8px'}}>
            <TextField
              label='Username'
              type='text'
              value={formData.username}
              name='username'
              onChange={handleChange}
            />
            <TextField
              label='Password'
              type='password'
              value={formData.password}
              name='password'
              onChange={handleChange}
            />
            <TextField
              label='Confirm Password'
              type='password'
              value={formData.confirmPassword}
              name='confirmPassword'
              onChange={handleChange}
            />
            </FormControl>
            <button type="submit" className="blue__btn">{isLoading?'Loading...':'Change Password'}</button>
        </form>
      </div>
    </div>
  )
}

export default FirstLogin;