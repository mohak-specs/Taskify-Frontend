import { Button, Grid,Modal,Paper,Stack, TextField, Typography,Box, FormControl, InputAdornment, IconButton, Avatar } from "@mui/material"
import {AccountCircleRounded, Visibility, VisibilityOff} from '@mui/icons-material'
import Navbar from "./Navbar"
import fetchUser from "../utils/fetchUser"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import Loader from "./Loader"
import { deepOrange } from "@mui/material/colors"
import {useTitle} from '../utils/useTitle'
import { useNavigate } from "react-router-dom"

const Account = () => {
  const user=fetchUser()
  const {token,data}=user?user:{token:'',data:''}
  const navigate=useNavigate()
  const [isModalOpen,setIsModalOpen]=useState(false)
  const [showPassword,setShowPassword]=useState(false)
  const [isLoading,setIsLoading]=useState(false)
  const handleClickShowPassword=()=>setShowPassword((prev)=>!prev)
  const handleMouseDownPassword=(e)=>{
    e.preventDefault()
  }
  const handleModalOpen=()=>setIsModalOpen(true)
  const handleModalClose=()=>setIsModalOpen(false)
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#f1f1f1',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [oldPassword,setOldPassword]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [confirmNewPassword,setConfirmNewPassword]=useState('')

  const changePassword=async(data,authToken)=>{
    try{
      setIsLoading(true)
      const res=await axios.post(`/auth/change`,data,{headers:{Authorization:`Bearer ${authToken}`}}) 
      toast.success(res.data?.message)   
    }catch(err){
      toast.error(err.response?.data?.message)
    }finally{
      setIsLoading(false)
      setIsModalOpen(false)
    }
  }
  const handleChangePasswordSubmit=(e)=>{
    e.preventDefault()
    if(newPassword!==confirmNewPassword){
      return toast.error('Password don\'t match')
    }
    const data={ oldPassword, newPassword, confirmNewPassword}
    changePassword(data,token)
    setOldPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
  }
  useTitle('Account')
  useEffect(()=>{
    if(!token){
      navigate('/',{state:{redirectUrl:`/account`}})
      toast.error('You need to login first to see task page',{toastId:'toast9'})
    }
  },[])
  return (
    <div>
      {/* <Navbar title={'Account Details'}/> */}
      <Grid container justifyContent='center' alignItems='center' sx={{height:'90vh'}}>
        <Paper sx={{m:2,p:2,maxHeight:'90vh',maxWidth:'640px',width:'640px',boxShadow:'2px 2px 3px 1px #000'}}>
          <Stack direction='column' alignItems='center'>
            {/* <AccountCircleRounded sx={{height:'128px',width:'128px',color:'#000080'}}/> */}
            <Avatar sx={{height:'128px',width:'128px',bgcolor:deepOrange[500]}}>
              <Typography sx={{fontSize:64}}>{data?.name?.[0]}</Typography>
            </Avatar>
          </Stack>
          <Stack direction='column' justifyContent='center'>
            <Typography variant="h6" fontFamily='inherit'>Name</Typography>
            <TextField variant="standard" InputProps={{readOnly: true}} value={data?.name}/>
          </Stack>
          <Stack direction='column' justifyContent='center'>
            <Typography variant="h6" fontFamily='inherit'>Employee Code</Typography>
            <TextField variant="standard" InputProps={{readOnly: true}} value={data?.emp_code}/>
          </Stack>
          <Stack direction='column' justifyContent='center'>
            <Typography variant="h6" fontFamily='inherit'>Email</Typography>
            <TextField variant="standard" InputProps={{readOnly: true}} value={data?.email}/>
          </Stack>
          {/* <Stack direction='column' justifyContent='center'>
            <Typography variant="h6" fontFamily='inherit'>Username</Typography>
            <TextField variant="standard" InputProps={{readOnly: true}} value={data?.username}/>
          </Stack> */}
          <Stack direction='column' justifyContent='center'>
            <Typography variant="h6" fontFamily='inherit'>Department</Typography>
            <TextField variant="standard" InputProps={{readOnly: true}} value={data?.dept}/>
          </Stack>
          <Stack direction='row' justifyContent='space-between' alignItems='center' marginTop={2}>
            <Button variant="outlined" color="secondary" sx={{marginRight:'2px','&:hover':{bgcolor:'#7b1fa2',color:'#fff'}}}>Change Username</Button>
            <Button onClick={handleModalOpen} variant="outlined" color="warning" sx={{'&:hover':{bgcolor:'#e65100',color:'#fff'}}}>Change Password</Button>
            <Modal
              open={isModalOpen}
              onClose={handleModalClose}
              aria-labelledby="password-reset"
              aria-describedby="password-reset"
            >
              <Box sx={modalStyle}>
                <Typography variant="h5" textAlign='center' color='#e65100' fontWeight={700}>Change Password</Typography>
                <Loader isLoading={isLoading}/>
                <form onSubmit={handleChangePasswordSubmit} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
                  <FormControl sx={{width:'100%',marginY:'2px',gap:'16px'}}>
                    <TextField
                      label='Old Password'
                      type={showPassword?'text':'password'}
                      value={oldPassword}
                      onChange={(e)=>setOldPassword(e.target.value)}
                      InputProps={{
                        endAdornment:<InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visiblity"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword?<VisibilityOff/>:<Visibility/>}
                          </IconButton>
                        </InputAdornment>
                      }}
                    > </TextField>  
                    <TextField
                      label='New Password'
                      type='password'
                      value={newPassword}
                      onChange={(e)=>setNewPassword(e.target.value)}
                    > </TextField>  
                    <TextField
                      label='Confirm New Password'
                      type='password'
                      value={confirmNewPassword}
                      onChange={(e)=>setConfirmNewPassword(e.target.value)}
                    > </TextField>  
                  </FormControl>
                  <Button type="submit" variant="contained" color="warning">Change Password</Button>
                </form>
              </Box>
            </Modal>
          </Stack>
        </Paper>
      </Grid>
    </div>
  )
}

export default Account
