import axios from 'axios';
import { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {Grid, Paper, Typography, InputLabel, Select,  MenuItem, FormControl, Divider, Chip, Button, TextField, Modal,Box,Stack} from '@mui/material'
import fetchUser from '../utils/fetchUser';
import Loader from './Loader';
import {getDate,getDateTime} from '../utils/getDate'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import TaskUpdateCard from './TaskUpdateCard';
import {DoneAllOutlined} from '@mui/icons-material';
import {findColorByStatus} from '../utils/statusChipData'
import { useTitle } from '../utils/useTitle';

const TaskCard = () => {
  const {taskId}=useParams();
  const user=fetchUser()
  const {token,data}=user?user:{token:'',data:''}
  const navigate=useNavigate()
  const [isLoading,setIsLoading]=useState(false)
  const [isModalOpen,setIsModalOpen]=useState(false)
  const [isUpdateLoading,setisUpdateLoading]=useState(false)
  const [taskData,setTaskData]=useState(null)
  const [updateReason,setUpdateReason]=useState('')
  const [updateDueDate,setUpdateDueDate]=useState(null)
  const [updateStatus,setUpdateStatus]=useState('OPEN')
  const [taskUpdates,setTaskUpdates]=useState(null)

  const handleOpen=()=>setIsModalOpen(true)
  const handleClose=()=>setIsModalOpen(false)

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#ffffff',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const getTaskData=async(taskId,authToken)=>{
    try{
      setIsLoading(true)
      const res=await axios.get(`/tasks/${taskId}`,{headers:{Authorization:`Bearer ${authToken}`}})
      setTaskData(res.data)
      setUpdateStatus(res.data.status)
    }catch(err){
      toast.error(err?.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }

  const getTaskUpdates=async(taskId,authToken)=>{
    try{
      setisUpdateLoading(true)
      const res=await axios.get(`/update/${taskId}`,{headers:{Authorization:`Bearer ${authToken}`}})
      setTaskUpdates(res.data)
    }catch(err){
      toast.error('Error while fetching task updates')
    }finally{
      setisUpdateLoading(false)
    }
  }

  const postTaskUpdate=async(data,taskId,authToken)=>{
    try{
      setisUpdateLoading(true)
      await axios.post(`/update/${taskId}`,data,{headers:{Authorization:`Bearer ${authToken}`}})
      toast.success('Task update has been added.')
    }catch(err){
      toast.error(err.response?.data?.message)
    }finally{
      getTaskUpdates(taskId,authToken)
      getTaskData(taskId,authToken)
      setisUpdateLoading(false)
    }
  }

  const markTaskComplete=async(taskId,authToken)=>{
    try{
      setIsLoading(true)
      const res=await axios.get(`/tasks/complete/${taskId}`,{headers:{Authorization:`Bearer ${authToken}`}})
      toast.success(res.data.message)
    }catch(err){
      toast.error(err.response?.data?.message)
    }finally{
      getTaskData(taskId,authToken)
      setIsLoading(false)
    }
  }
  const deleteTask=async(taskId,authToken)=>{
    try{
      await axios.delete(`/tasks/${taskId}`,{headers:{Authorization:`Bearer ${authToken}`}})
      toast.success('Task has been deleted.')
    }catch(err){
      toast.error(err.response?.data?.message)
    }finally{
      navigate('/tasks')
    }
  }

  const onDeleteTask=()=>{
    deleteTask(taskId,token)
  }

  const onClickComplete=()=>{
    markTaskComplete(taskId,token)
  }

  const handleUpdateSubmit=(e)=>{
    e.preventDefault()
    if(!updateReason){
      return toast.error('Update reason can not empty')
    }
    const data={
      committedDate:updateDueDate?updateDueDate.$d.toISOString():taskData?.dueDate,
      updateStatus:updateStatus,
      updateReason:updateReason
    }
    postTaskUpdate(data,taskId,token)
    setUpdateDueDate(null)
    setUpdateReason('')
    setUpdateStatus(taskData?.status)
  }
  useTitle('Task Card')
  useEffect(()=>{
    if(token){
      getTaskData(taskId,token)
      getTaskUpdates(taskId,token)
    }
  },[])

  return (
    <div>
      <Loader isLoading={isLoading}/>
      {/* <Navbar title={'Task Card'}/> */}
    <Grid container spacing={1} sx={{marginTop:'2px'}}>
      <Grid item xs={12} md={6}>
        <Paper elevation={4} sx={{p:'6px'}}>
          <div className='task__title__row'>
            <Typography variant='subtitle1' component='h4' sx={{fontSize:24,letterSpacing:'1px',fontFamily:'inherit'}}>{taskData?.tname}</Typography>
            {taskData?.author._id===data?._id && (
              <div>
                {taskData.completed ? (
                  <Button onClick={onClickComplete} startIcon={<DoneAllOutlined/>} variant='contained' size='medium' color='success'>COMPLETED</Button>
                ):(
                  <Button onClick={onClickComplete} startIcon={<DoneAllOutlined/>} variant='outlined' size='medium' sx={{color:'#999',borderColor:'#999','&:hover':{color:'green',bgcolor:'rgba(0,255,0,0.1)',borderColor:'green'}}}>MARK COMPLETE</Button>
                )}
              </div>
            )}
          </div>
          <Divider sx={{mt:'2px'}}/>
          <Stack direction='row' justifyContent='space-between' sx={{mt:'2px'}}>
            <Typography variant='subtitle1'>Created at: <span>{getDateTime(taskData?.createdAt)}</span></Typography>
            <Typography variant='subtitle1'>Last updated at: <span>{getDateTime(taskData?.updatedAt)}</span></Typography>
          </Stack>
          <Stack direction='column' spacing={1} sx={{mt:'5px'}}>
            <Typography variant='subtitle1' component='h1'>Description</Typography>
            <Box sx={{height:'4rem',border:'2px solid #f1f1f1',p:'4px',borderRadius:'4px',overflowY:'auto'}}>
              <Typography variant='body1' component='p' sx={{overflowWrap:'break-word'}}>{taskData?.tdesc}</Typography>
            </Box>
            <Stack direction='row' spacing={1} justifyContent='flex-start' alignItems='center' sx={{mt:'1px'}}>
              <Typography variant='subtitle1' component='h1'>Created By</Typography>
              <Chip label={taskData?.author.name} variant='outlined' color='secondary'/>
            </Stack>
            <Stack direction='row' spacing={2} justifyContent='flex-start' alignItems='center' sx={{mt:'1px'}}>
              <Typography variant='subtitle1' component='h1'>Assignee</Typography>
              <Stack direction='row' spacing={2} sx={{justifyContent:'flex-start',flexWrap:'wrap'}}>
                {taskData?.assignTo.map((user,i)=>(
                  <div>
                    <Chip key={i} color='primary' variant='outlined' label={user?.name}/>
                  </div>
                ))}
              </Stack>
            </Stack>
            <Stack direction='row' spacing={5} justifyContent='flex-start' alignItems='center' sx={{mt:'1px'}}>
              <Typography variant='subtitle1' component='h1'>Status</Typography>
              <Chip label={taskData?.status} variant='outlined' color={taskData?findColorByStatus(taskData.status):'default'}/>
            </Stack>
          </Stack>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography variant='subtitle1' component='h1'>Start date: <span style={{marginLeft:'12px',color:'#5a5a5a'}}>{getDate(taskData?.startDate)}</span></Typography>
          <Typography variant='subtitle1' component='h1'>Due Date: <span style={{marginLeft:'12px',color:'#5a5a5a'}}>{getDate(taskData?.dueDate)}</span></Typography>
        </Stack>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{mt:'8px'}}>
          <Link to='/tasks' style={{textDecoration:'none'}}>
            <Button variant='outlined' color='info' sx={{'&:hover':{bgcolor:'#03a9f4',color:'white'}}}>Go Back</Button>
          </Link>
          {taskData?.author._id===data?._id && (
            <div>
              <Button onClick={handleOpen} variant='outlined' color='error' sx={{'&:hover':{bgcolor:'#ef5350',color:'white'}}}>Delete Task</Button>
              <Modal
                open={isModalOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={modalStyle}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                      Do you really want to delete this task ?
                  </Typography>
                  <Button  onClick={onDeleteTask} id="modal-modal-description" sx={{ mt: 2, '&:hover':{bgcolor:'#ef5350',color:'white'} }} variant='outlined' color='error'>
                    Yes
                  </Button>
                </Box>
              </Modal>
            </div>
          )}
        </Stack>
        <Divider sx={{borderBottomWidth:5}} textAlign='center'><Typography variant='h6' sx={{color:'#000080'}}>Update Task</Typography></Divider>
        {taskData?.assignTo.map((user)=>user._id).concat([taskData?.author._id]).includes(data?._id) && (
            <form onSubmit={handleUpdateSubmit}>
            <FormControl sx={{width:'100%',display:'flex',flexDirection:'column',gap:'4px'}}>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='New due date'
                  value={updateDueDate}
                  onChange={(newValue)=>setUpdateDueDate(newValue)}
                  renderInput={(params)=><TextField size='small' {...params}/>}
                />
              </LocalizationProvider>
              <FormControl>
                <InputLabel id='update-status'>Update Status</InputLabel>
                <Select
                  labelId='update-status'
                  id="update-status"
                  value={updateStatus}
                  label='Update Status'
                  onChange={(e)=>setUpdateStatus(e.target.value)}
                  sx={{bgcolor:'#f9f9f9',width:'100%'}}
                  size='small'
                >
                  <MenuItem value='OPEN'>OPEN</MenuItem>
                  <MenuItem value='IN PROGRESS'>IN PROGRESS</MenuItem>
                  <MenuItem value='ON HOLD'>ON HOLD</MenuItem>
                  <MenuItem value='CANCELLED'>CANCELLED</MenuItem>
                  <MenuItem value='CLOSED'>CLOSED</MenuItem>
                  </Select> 
            </FormControl>
            </Stack>
            <TextField
              id="outlined-multiline-static"
              label='State reason of why you are updating task'
              multiline
              rows={3}
              value={updateReason}
              onChange={(e)=>setUpdateReason(e.target.value)}
              sx={{mt:'4px',fontFamily:'inherit'}} 
            />
            <Typography variant='subtitle2' component='h1' sx={{fontFamily:'inherit'}}>Updating as {data?.name}</Typography>
            <Button variant='contained' color='info' type='submit'>Update Task</Button>
          </FormControl>
          </form>
          )}
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Loader isLoading={isUpdateLoading}/>
        <TaskUpdateCard taskUpdates={taskUpdates}/>
      </Grid>
    </Grid>
    </div>
  )
}
export default TaskCard