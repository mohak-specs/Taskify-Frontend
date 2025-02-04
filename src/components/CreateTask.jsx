import axios from 'axios'
import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import fetchUser from '../utils/fetchUser'
import Loader from './Loader'
import {useNavigate} from 'react-router-dom'
import { Autocomplete,Button,Stack,TextField,Typography,Box,Switch,FormGroup,FormControlLabel, Select,MenuItem} from '@mui/material'
import ReactQuill from 'react-quill'
import {modules,formats} from '../utils/quillUtil'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
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
  const [startDate,setStartDate]=useState(dayjs().startOf('day').toISOString())
  const [startDateChanged,setStartDateChanged]=useState(false)
  const [dueDate,setDueDate]=useState(null)
  const [recurCheck,setRecurCheck] = useState(false)
  const [recurAmount,setRecurAmount] = useState()
  const [formData,setFormData]=useState({
    tname:'',
    tdesc:'',
  })
  const [tnameTouched,setTnameTouched] = useState(false)
  const [dropTouched,setDropTouched] = useState(false)
  const quillRef = useRef(null)
  const [autoKey,setAutoKey]=useState(0)
  const getAccountData=async(authToken)=>{
    try{
      // '/users?except=true'
      setIsLoading(true)
      const res=await axios.get('/users',{headers:{Authorization:`Bearer ${authToken}`}})
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
    else{
      navigate('/',{state:{redirectUrl:`/create`}})
      toast.error('You need to login first to see task page',{toastId:'toast8'})
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

  const handleSubmit=async(e)=>{
    e.preventDefault()
    const assignTo=selectedOption?.map((user)=>user._id)
    const data={
      ...formData,
      assignTo,
      startDate:startDateChanged?startDate.$d.toISOString():startDate,
      dueDate:dayjs(dueDate?.$d.toISOString()).endOf('day').toISOString(),
      recurAmount
    }
    if(!formData.tname){
      toast.error('Task name is required.')
    }
    else if(!dueDate){
      toast.error('Due date is required.')
    }else if(recurCheck && recurAmount<1){
      toast.error('Recurred days can\'t be less than 1')
    }else{
      await postTask(data,token)
    }
    setFormData({tdesc:'',tname:''})
    setAutoKey((prev)=>prev+1)
    setSelectedOption([])
    setDueDate(null)
    setStartDate(dayjs().startOf('day').toISOString())
    setStartDateChanged(false)
  }
  return (
    <div>
      <Loader isLoading={isLoading}/>
      <div className='create__container'>
      <form onSubmit={handleSubmit} className='create__form'>
        <Typography variant='h4' sx={{margin:'0 auto',fontWeight:600}}>Create Task</Typography>
        <div className='create__form__child'>
        <Box
          sx={{
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
          }}
        >
          <Typography variant='subtitle1' component='h1' fontWeight='bold' color='#ff9800'>*Task name and Due date are required</Typography>
          <FormGroup>
            <FormControlLabel 
              control={<Switch
                  checked={recurCheck}
                  onChange={(e)=>setRecurCheck(e.target.checked)}
                  color='primary'
                />
              } 
              label={<Typography variant='body1' fontWeight='bold' color='primary'>Recurring Task</Typography>}
              labelPlacement='start'
            />
          </FormGroup>
        </Box>
        <TextField
          error={!formData.tname && tnameTouched}
          type='text'
          id='tname'
          name='tname'
          value={formData.tname}
          onChange={handleChange}
          onBlur={(e)=>setTnameTouched((prev)=>!prev)}
          placeholder='Enter task name'
          autoComplete='off'
          size='small'
          label='Task name'
          helperText={!formData.tname && tnameTouched?"Error":""}
          required
        />
        <label htmlFor='tdesc'>Task Description</label>
        <div className="editor-container">
        <ReactQuill
          placeholder='Enter task description here...'
          theme='snow'
          ref={quillRef}
          value={formData.tdesc}
          modules={modules}
          formats={formats}
          onChange={(value) => setFormData({ ...formData, tdesc: value })}
          style={{height:'100%'}}  
        />
        </div>
        
        <label htmlFor='tags-outlined'>Assign Task to</label>
        <Stack spacing={3} sx={{width:'100%',backgroundColor:'#fff','&:hover':{borderColor:'blue'}}}>
          <div>
          <Autocomplete
            key={autoKey}
            multiple
            sx={{maxWidth:'540px',margin:0,width:'100%'}}
            id='tags-filled'
            size='small'
            options={accountData}
            getOptionLabel={(option)=>`${option?.name} (${option?.dept})`}
            renderOption={(props, option) => (
              <Box component="li" sx={{ maxHeight:'50px',overflowY:'auto','& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                {option?.name} ({option?.dept}) {option?.email}
              </Box>
            )}
            filterSelectedOptions
            disablePortal 
            onChange={handleChangeComplete}
            name='assignTo'
            renderInput={(params) => (
              <TextField
                error={selectedOption.length==0 && dropTouched}
                onBlur={(e)=>setDropTouched((prev)=>!prev)}
                {...params}
                placeholder="Enter Employee name"
                helperText={selectedOption.length==0 && dropTouched ? 'You must assign task to atleast one employee':''}
              />
            )}
          />
          </div>
        </Stack>
        <div className="create__date">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Task Start Date'
              value={startDate}
              inputFormat='DD/MM/YYYY'
              onChange={(newValue)=>{
                setStartDate(newValue)
                setStartDateChanged(true);
              }}
              renderInput={(params)=> <TextField {...params}/>}
              className='date__picker'
            />
            <DatePicker
              label='Task Due Date'
              value={dueDate}
              inputFormat='DD/MM/YYYY'
              onChange={(newValue)=>setDueDate(newValue)}
              renderInput={(params)=> (<TextField 
                {...params} 
                required
              />  
              )}
              className='date__picker'
            />
          </LocalizationProvider>
        </div>
        {recurCheck && (
            <TextField
              error={recurAmount<=0}
              type='number'
              placeholder='Enter number of days'
              value={recurAmount}
              onChange={(e)=>setRecurAmount(e.target.value)}
              autoComplete='off'
              size='small'
              label='Recurring days'
              helperText={recurAmount<=0?'Recurring days must be greater than 0':''}
              required
            />
          )}
        <Button type='submit' variant='contained' size='large' fullWidth sx={{mt:2,'&:hover':{bgcolor:'#1565c0'}}}>Add Task</Button>
        </div>
      </form>
      </div>
    </div>
  )
}

export default CreateTask;