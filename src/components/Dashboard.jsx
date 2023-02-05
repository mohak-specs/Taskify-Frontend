import { useEffect, useState } from "react"
import fetchUser from "../utils/fetchUser"
import axios from "axios"
import { toast } from "react-toastify"
import Loader from "./Loader"

// Icons
import {AiFillFolderOpen} from 'react-icons/ai'
import {HiLockClosed} from 'react-icons/hi'
import {IoMdNotificationsOutline} from 'react-icons/io'
import StatCard from "./StatCard"
import { useTitle } from "../utils/useTitle"
import DoughnutChart from "./DoughnutChart"
import DashTabs from "./DashTabs"
import { Paper,Typography } from "@mui/material"

const Dashboard = () => {
  const user=fetchUser()
  const {token,data}=user?user:{token:'',data:''}
  const [taskData,setTaskData]=useState(null)
  const [notifyData,setNotifyData]=useState(null)
  const [isLoading,setIsLoading]=useState(false)

  const getAllTasks=async(authToken)=>{
    try{
      setIsLoading(true)
      const res=await axios.get('/tasks',{headers:{Authorization:`Bearer ${authToken}`}})
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
    }
  },[])
  return (
    <div style={{height:'90%'}}>
      <Loader isLoading={isLoading}/>
      {/* <Navbar title={'Dashboard'}/> */}
      <p className="dash__welcome">Welcome, {data?.name}</p>
      <div className="dashboard__container">
        <div className="dashboard__overview">
          <div className="dashboard__charts">
            <DoughnutChart stats={taskData?.stats}/>
            <DashTabs/>
          </div>
          <Paper elevation={4} sx={{display:'flex',justifyContent:'center',alignItems:'center'}} className="dashboard__tabs">
              <Typography>Line Chart for task completed V/s month</Typography>
              <Typography>Coming Soon...</Typography>
          </Paper>
        </div>
        <div className="dashboard__stats">
          <StatCard statType={'TASKS OPENED'} statData={taskData?.stats?.numOpenedTask} icon={AiFillFolderOpen}/>
          <StatCard statType={'UNREAD TASK UPDATES'} statData={notifyData?notifyData.unread:0} icon={IoMdNotificationsOutline}/>
          <StatCard statType={'TASKS COMPLETED'} statData={taskData?.stats?.numCompletedTask} icon={HiLockClosed}/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard