import React, { useEffect, useState } from 'react'
import {useParams,useLocation,useNavigate,useOutletContext} from 'react-router-dom'
import { toast } from 'react-toastify'
import {Typography,TextField,Divider,InputAdornment, Button} from '@mui/material'
import {Key} from '@mui/icons-material'
import isNumeric from '../utils/isNumeric'
import axios from 'axios'
const PasswordOTP = () => {
  const {resetToken} = useParams()
  const [setIsLoading] = useOutletContext()
  const navigate = useNavigate()
  const {state} = useLocation()
  const message = state?.message
  const [otp,setOtp] = useState('')
  const checkOTP = async(token)=>{
    try{
      if(otp.length==0){
        throw Error('OTP can not be empty.')
      }
      if(!isNumeric(otp)){
        throw Error('OTP can only be a number')
      }
      if(otp.length>6){
        throw Error("OTP can't exceed more than 6 digit")
      }
      setIsLoading(true)
      const res = await axios.post(`/auth/check-otp/${token}`,{otp})
      toast.success(res?.data?.message)
      navigate(`../reset/${resetToken}`,{state:{isOTPVerified:res?.data?.isOTPVerified}})
    }catch(err){
      if(Object.keys(err).length == 0){
        return toast.error(err?.message)
      }
      toast.error(err?.response?.data?.error)
    }finally{
      setIsLoading(false)
      setOtp('')
    }
  }
  useEffect(()=>{
    if(!(message && resetToken)){
      navigate('/')
      toast.error('Please go to forgot password page to get otp',{toastId:'toast4'})
    }
  },[])
  const handleOTPSubmit=(e)=>{
    e.preventDefault()
    checkOTP(resetToken)
  }
  return (
    <div className='auth-box'>
      <Typography variant='h5' component='div' style={{textAlign:'center',fontWeight:400,letterSpacing:'2px'}}>RECOVER YOUR PASSWORD</Typography>
      <Divider style={{border:'2px solid #42a5f5'}} />
      <Typography variant='subtitle1' component='p' textAlign='center' color='lightslategray'>{message.split('\n').join(' ')}</Typography>
      <TextField 
        label='Enter 6 digit OTP'
        variant='outlined'
        type='text'
        value={otp}
        onChange={(e)=>setOtp(e.target.value)}
        size='medium'
        sx={{width:'100%'}}
        InputProps={{
          startAdornment:(
            <InputAdornment position='start'>
              <Key sx={{color:'#42a5f5'}}/>
            </InputAdornment>
          )
        }}
        required
      />
      <Button 
        variant='outlined'
        color='warning'
        onClick={handleOTPSubmit}
        sx={{
          transition:'background-color 0.25s ease-in-out',
          '&:hover':{backgroundColor:'#ff9800',color:'white'},
          marginBottom:'15px'
        }}
      >
        Confirm OTP
      </Button>
    </div>
  )
}

export default PasswordOTP