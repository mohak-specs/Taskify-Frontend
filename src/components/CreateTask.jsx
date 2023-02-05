import axios from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import fetchUser from '../utils/fetchUser'
import Loader from './Loader'
import {useNavigate} from 'react-router-dom'
import { Autocomplete,Button,Divider,MenuItem,Select,Stack,TextField,Typography} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTitle } from '../utils/useTitle'


const CreateTask = () => {
  const user=fetchUser()
  const {token,data}=user?user:{token:'',data:''}
  const navigate=useNavigate()
  const [isLoading,setIsLoading]=useState(false)
  const [accountData,setAccountData]=useState([])
  const [selectedOption,setSelectedOption]=useState([])
  const [startDate,setStartDate]=useState(null)
  const [dueDate,setDueDate]=useState(null)
  const [formData,setFormData]=useState({
    tname:'',
    tdesc:'',
  })
  const [autoKey,setAutoKey]=useState(0)
  const getAccountData=async(authToken)=>{
    try{
      setIsLoading(true)
      const res=await axios.get('/users?except=true',{headers:{Authorization:`Bearer ${authToken}`}})
      setAccountData(res.data)
    }catch(err){
      toast.error(err?.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }
  useTitle('Create Task')
  useEffect(()=>{
    if(token){
      getAccountData(token)
    }
  },[])

  const handleChange=(e)=>{
    const {name,value}=e.target
    setFormData((prev)=>({
      ...prev,
      [name]:value
    }))
  }
  const handleChangeComplete=(event,newValue)=>{
      setSelectedOption(newValue)
  }

  const postTask=async(data,authToken)=>{
    try{
      setIsLoading(true)
      const res=await axios.post('/tasks',data,{headers:{Authorization:`Bearer ${authToken}`}})
      toast.success('Task has been added successfully')
      navigate('/tasks') // after task card, we will redirect it to view card
    }catch(err){
      toast.error(err.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }

  const handleSubmit=(e)=>{
    e.preventDefault()
    const assignTo=selectedOption?.map((user)=>user._id)
    const data={
      ...formData,
      assignTo,
      startDate:startDate?startDate.$d.toISOString():null,
      dueDate:dueDate?.$d.toISOString()
    }
    if(!formData.tname){
      toast.error('Task name is required.')
    }
    else if(!dueDate){
      toast.error('Due date is required.')
    }else{
      postTask(data,token)
    }
    setFormData({status:'OPEN',tdesc:'',tname:''})
    setAutoKey((prev)=>prev+1)
    setSelectedOption([])
    setDueDate(null)
    setStartDate(null)
  }


  return (
    <div>
      <Loader isLoading={isLoading}/>
      <div className='create__container'>
      <form onSubmit={handleSubmit} className='create__form'>
        <Typography variant='subtitle1' component='h1'>*Task name and Due date are required</Typography>
        <label htmlFor="tname">Task Name</label>
        <input 
          type="text" 
          id='tname' 
          name='tname' 
          value={formData.tname}
          onChange={handleChange}
          placeholder='Task name' 
          autoComplete='off'
          required/>
        <label htmlFor='tdesc'>Task Description</label>
        <textarea 
          placeholder='Enter task description here...'
          id='tdesc'
          name='tdesc'
          value={formData.tdesc}
          onChange={handleChange}></textarea>
        <label htmlFor='tags-outlined'>Assign Task to</label>
        <Stack spacing={3} sx={{width:'100%',backgroundColor:'#fff','&:hover':{borderColor:'blue'}}}>
          <Autocomplete
            key={autoKey}
            multiple
            id="tags-filled"
            options={accountData}
            getOptionLabel={(option) => option?.name}
            // filterSelectedOptions
            onChange={handleChangeComplete}
            name='assignTo'

            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter Employee name"
              />
            )}
          />
        </Stack>
        <div className="create__date">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Task Start Date'
              value={startDate}
              onChange={(newValue)=>setStartDate(newValue)}
              renderInput={(params)=> <TextField {...params}/>}
              className='date__picker'
            />
            <DatePicker
              label='Task Due Date'
              value={dueDate}
              onChange={(newValue)=>setDueDate(newValue)}
              renderInput={(params)=> <TextField {...params}/>}
              className='date__picker'
            />
          </LocalizationProvider>
        </div>
        {/* <button className='create__submit' type='submit'>Add Task</button> */}
        <Button type='submit' variant='contained' size='large' fullWidth sx={{mt:2,'&:hover':{bgcolor:'#1565c0'}}}>Add Task</Button>
      </form>
      </div>
    </div>
  )
}

export default CreateTask;