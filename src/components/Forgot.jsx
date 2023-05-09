import React,{useState} from 'react'
import {useOutletContext,useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import axios from 'axios'
import {Button,Typography,Divider,TextField} from '@mui/material'
const Forgot = () => {
  const [setIsLoading] = useOutletContext()
  const navigate = useNavigate()
  const [email,setEmail] = useState('')
  const getPasswordOTP=async()=>{
    try{
      if(!email.length > 0){
        throw Error('Please enter your email address.')
      }
      setIsLoading(true)
      const res = await axios.post('/auth/forgot-req',{input:email})
      toast.success(res?.data?.message)
      navigate(`../checkotp/${res?.data?.passwordToken}`,{state:{message:res?.data?.message}})
    }catch(err){
      if(Object.keys(err).length == 0){
        return toast.error(err?.message)
      }
      toast.error(err?.response?.data?.message)
    }finally{
      setIsLoading(false)
      setEmail('')
    }
  }
  const handleFindSubmit=(e)=>{
    e.preventDefault()
    getPasswordOTP()
  }
  return (
    <div className='auth-box'>
      <Typography variant='h5' component='div' style={{textAlign:'center',fontWeight:400,letterSpacing:'2px'}}>RECOVER YOUR PASSWORD</Typography>
      <Divider style={{border:'2px solid #42a5f5'}} />
      <div>
        <Typography variant='overline' component='p' textAlign='center'>Please enter your email:</Typography>
        <TextField 
          label='Email Address'
          variant='outlined'
          type='email'
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          sx={{width:'100%'}}
          required
        />
      </div>
      <Button
        variant='contained'
        color='info'
        size='small'
        onClick={handleFindSubmit}
      >
        Find your account
      </Button>
      <Divider textAlign='center' sx={{}}>
        <Typography variant='caption' sx={{letterSpacing:'1px'}}>CAN'T FIND YOUR ACCOUNT?</Typography>
      </Divider>
      <Button
        variant='contained'
        color='success'
        size='small'
        disabled
      >
        CREATE YOUR ACCOUNT
      </Button>
    </div>
  )
}

export default Forgot