import React,{useEffect,useState} from 'react'
import {useOutletContext,useNavigate,useParams,useLocation} from 'react-router-dom'
import {Typography,Divider,TextField,Button,IconButton,InputAdornment} from '@mui/material'
import {Visibility,VisibilityOff} from '@mui/icons-material'
import { toast } from 'react-toastify'
import axios from 'axios'
const ResetPassword = () => {
  const [password,setPassword]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')
  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword,setShowConfirmPassword] =useState(false)
  const [setIsLoading] = useOutletContext()
  const navigate = useNavigate()
  const {resetToken} = useParams()
  const {state} = useLocation()
  const isOTPVerified = state?.isOTPVerified

  const handleClickShowPassword=()=>setShowPassword((prev)=>!prev)
  const handleClickConfirmShowPassword=()=>setShowConfirmPassword((prev)=>!prev)
  const handleMouseDownPassword=(e)=>{
    e.preventDefault()
  }
  const resetPassword=async(token,data)=>{
    try{
      setIsLoading(true)
      const res = await axios.post(`/auth/reset/${token}`,data)
      toast.success(res?.data?.message)
      navigate('/')
    }catch(err){
      toast.error(err?.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }

  const handleSubmit=(e)=>{
    e.preventDefault()
    const data = {
      password,
      passwordConfirm:confirmPassword
    }
    resetPassword(resetToken,data)
    setPassword('')
    setConfirmPassword('')
  }
  useEffect(()=>{
    if(!(resetToken && isOTPVerified)){
      toast.error('Please confirm your otp to change password')
      navigate('/')
    }
  },[])
  return (
    <div className='auth-box'>
      <Typography variant='h5' component='div' style={{textAlign:'center',fontWeight:400,letterSpacing:'2px'}}>RESET PASSWORD</Typography>
      <Divider style={{border:'2px solid #42a5f5'}} />
        <TextField 
          label='Password'
          variant='outlined'
          type={showPassword?'text':'password'}
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          InputProps={{
            endAdornment:(
              <InputAdornment position='end'>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {showPassword ? <VisibilityOff/>: <Visibility/>}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{width:'100%'}}
          required
        />
        <TextField 
          label='Confirm Password'
          variant='outlined'
          type={showConfirmPassword?'text':'password'}
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment:(
              <InputAdornment position='end'>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickConfirmShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {showConfirmPassword ? <VisibilityOff/>: <Visibility/>}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{width:'100%'}}
          required
        />
      <Button
        variant='contained'
        color='info'
        size='medium'
        onClick={handleSubmit}
      >
        Change Password
      </Button>
    </div>
  )
}

export default ResetPassword