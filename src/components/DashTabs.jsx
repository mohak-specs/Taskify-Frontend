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
        <Box sx={{p:3,display:'flex',flexDirection:'column',justifyContent:'space-between',gap:'32px',bgcolor:'#F8F8F8',height:'100%',maxHeight:'200px',overflowY:'auto',overflowX:'hidden'}}>
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
          <Typography variant="h6" sx={{marginTop:'8px'}}>Tasks Overview (Sorted by Due Date)</Typography>
        </Box>
        <Tabs value={tabValue} onChange={handleChange} aria-label='task tabs'>
          <Tab label="OPEN" {...allyProps(0)}/>
          <Tab label="CLOSED" {...allyProps(1)}/>
          <Tab label="IN PROGRESS" {...allyProps(2)}/>
          <Tab label="ON HOLD" {...allyProps(3)}/>
          <Tab label="COMPLETED" {...allyProps(4)}/>
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {tasks?.sort((a,b)=>new Date(b?.dueDate).getTime() - new Date(a?.dueDate).getTime()).filter((task)=>task?.status==='OPEN').map((taskData)=>(
          <TaskBar taskData={taskData}/>
        ))}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {tasks?.sort((a,b)=>new Date(b?.dueDate).getTime() - new Date(a?.dueDate).getTime()).filter((task)=>task?.status==='CLOSED').map((taskData)=>(
          <TaskBar taskData={taskData}/>
        ))}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {tasks?.sort((a,b)=>new Date(b?.dueDate).getTime() - new Date(a?.dueDate).getTime()).filter((task)=>task?.status==='IN PROGRESS').map((taskData)=>(
          <TaskBar taskData={taskData}/>
        ))}
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {tasks?.sort((a,b)=>new Date(b?.dueDate).getTime() - new Date(a?.dueDate).getTime()).filter((task)=>task?.status==='ON HOLD').map((taskData)=>(
          <TaskBar taskData={taskData}/>
        ))}
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
      {tasks?.sort((a,b)=>new Date(b?.dueDate).getTime() - new Date(a?.dueDate).getTime()).filter((task)=>task?.completed===true).map((taskData)=>(
          <TaskBar taskData={taskData}/>
        ))}
      </TabPanel>
    </Paper>
  )
}

export default DashTabs;