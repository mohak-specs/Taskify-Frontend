import { Paper, Tabs, Typography,Box, Tab } from "@mui/material"
import PropTypes from 'prop-types'
import { useState } from "react"
import TaskBar from "./TaskBar";

const TabPanel=(props)=>{
  const {children,value,index,...other}=props;
  return(
    <div
      role="tabpanel"
      hidden={value!==index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value===index && (
        <Box sx={{p:3,display:'flex',flexDirection:'column',justifyContent:'space-between',gap:'32px',bgcolor:'#F8F8F8'}}>
          {children}
        </Box>
      )}
    </div>
  )
}

TabPanel.prototype={
  children:PropTypes.node,
  index:PropTypes.number.isRequired,
  value:PropTypes.number.isRequired
}

const allyProps=(index)=>{
  return{
    id:`simple-tab-${index}`,
    'aria-controls':`simple-tabpanel-${index}`
  }
}

const DashTabs = ({tasks}) => {
  const [tabValue,setTabValue]=useState(0);
  const handleChange=(e,newValue)=>{
    setTabValue(newValue)
  }
  return (
    <Paper elevation={4} sx={{width:'100%'}}>
      <Box sx={{borderBottom:1,borderColor:'divider'}}>
        <Box sx={{width:'100%',ml:'20px'}}>
          <Typography variant="h6" sx={{marginTop:'8px'}}>Latest 3 Tasks</Typography>
        </Box>
        <Tabs value={tabValue} onChange={handleChange} aria-label='task tabs'>
          <Tab label="OPEN" {...allyProps(0)}/>
          <Tab label="CLOSED" {...allyProps(1)}/>
          <Tab label="COMPLETED" {...allyProps(2)}/>
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {tasks?.sort((a,b)=>new Date(a?.dueDate).getTime()-new Date(b?.dueDate).getTime()).filter((task)=>task?.status==='OPEN').slice(0,3).map((taskData)=>(
          <TaskBar taskData={taskData}/>
        ))}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {tasks?.sort((a,b)=>new Date(a?.dueDate).getTime()-new Date(b?.dueDate).getTime()).filter((task)=>task?.status==='CLOSED').slice(0,3).map((taskData)=>(
          <TaskBar taskData={taskData}/>
        ))}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
      {tasks?.sort((a,b)=>new Date(a?.dueDate).getTime()-new Date(b?.dueDate).getTime()).filter((task)=>task?.completed===true).slice(0,3).map((taskData)=>(
          <TaskBar taskData={taskData}/>
        ))}
      </TabPanel>
    </Paper>
  )
}

export default DashTabs;