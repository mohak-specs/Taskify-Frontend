import { useEffect, useState } from "react"
import fetchUser from "../utils/fetchUser"
import axios from "axios"
import { toast } from "react-toastify"
import Loader from "./Loader"
import {Typography,Paper, Stack,FormGroup,FormControlLabel,Switch} from '@mui/material'
// Icons
import {AiFillFolderOpen} from 'react-icons/ai'
import {IoCheckmarkDone} from 'react-icons/io5'
import {IoMdNotificationsOutline} from 'react-icons/io'
import StatCard from "./StatCard"
import { useTitle } from "../utils/useTitle"
import DoughnutChart from "./DoughnutChart"
import DashTabs from "./DashTabs"
import { useNavigate } from "react-router-dom"


const Dashboard = () => {
  const user=fetchUser()
  const navigate = useNavigate()
  const {token,data}=user?user:{token:'',data:''}
  const [taskData,setTaskData]=useState(null)
  const [notifyData,setNotifyData]=useState(null)
  const [isLoading,setIsLoading]=useState(false)
  const [checked,setChecked] = useState(false)

  const getAllTasks=async(authToken)=>{
    try{
      setIsLoading(true)
      const res=await axios.get(`/tasks?showDeptWise=${checked?true:''}`,{headers:{Authorization:`Bearer ${authToken}`}})
      setTaskData(res.data)
    }catch(err){
      toast.error(err?.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }

  const getAllNotifys=async(authToken)=>{
    try{
      setIsLoading(true)
      const res=await axios.get('/notify',{headers:{Authorization:`Bearer ${authToken}`}})
      setNotifyData(res.data)
    }catch(err){
      toast.error(err?.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }
  useTitle('Dashboard')
  useEffect(()=>{
    if(token){
      getAllTasks(token)
      getAllNotifys(token)
    }else{
      navigate('/',{state:{redirectUrl:`/dashboard`}})
      toast.error('You need to login first to see task page',{toastId:'toast6'})
    }
  },[checked])
  return (
    <div style={{height:'90%'}}>
      <Loader isLoading={isLoading}/>
      {/* <Navbar title={'Dashboard'}/> */}
      <p className="dash__welcome">
        <p>Welcome, {data?.name}</p>
        {data?.role === 'department head' && (
          <FormGroup>
            <FormControlLabel 
              control={<Switch
                  checked={checked}
                  onChange={(e)=>setChecked(e.target.checked)}
                />
              } 
              label='Show Department Wise'
            />
          </FormGroup>
        )}
      </p>
      <div className="dashboard__container">
        <div className="dashboard__overview">
          <div className="dashboard__charts">
            <DoughnutChart stats={taskData?.stats}/>
            <DashTabs tasks={taskData?.tasks}/>
          </div>
          <Paper elevation={4} sx={{display:'flex',flexDirection:'column',gap:'4px',p:'8px'}} className="dashboard__tabs">
              <Typography sx={{mt:'8px',fontSize:24}}>New update 0.0.1 features</Typography>
              <Stack flexDirection='row' gap={4}>
                <Stack flexWrap='wrap'>
                  <Typography variant="body1">Major Changes</Typography>
                  <Typography variant="body2" fontWeight={300}>You can assign a task to yourself</Typography>
                  <Typography variant="body2" fontWeight={300}>Introduced task color system (Red for late,Yellow for in progress,Green for closed/completed)</Typography>
                  <Typography variant="body2" fontWeight={300}>Now only task author can change committed date, you can update author to change due date</Typography>
                  <Typography variant="body2" fontWeight={300}>Export tasks list and updates(only csv is supported as of now)</Typography>
                </Stack>
                <Stack>
                  <Typography variant="body1">Minor Changes</Typography>
                  <Typography variant="body2" fontWeight={300}>Author can not change status to completed if current status is on hold or cancelled</Typography>
                  <Typography variant="body2" fontWeight={300}>Fixed assign task sorting in create task form</Typography>
                  <Typography variant="body2" fontWeight={300}>Date format is changed to DD MM,YYYY HH:MM AM/PM</Typography>
                  <Typography variant="body2" fontWeight={300}>Added link to website in task emails</Typography>
                  <Typography variant="body2" fontWeight={300}>Added task name in subject of every task email</Typography>
                </Stack>
              </Stack>
          </Paper>
        </div>
        <div className="dashboard__stats">
          <StatCard statType={'TASKS OPENED'} statData={taskData?.stats?.numOpenedTasks} icon={AiFillFolderOpen}/>
          <StatCard statType={'UNREAD TASK UPDATES'} statData={notifyData?notifyData.unread:0} icon={IoMdNotificationsOutline}/>
          <StatCard statType={'TASKS COMPLETED'} statData={taskData?.stats?.numCompletedTasks} icon={IoCheckmarkDone}/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard