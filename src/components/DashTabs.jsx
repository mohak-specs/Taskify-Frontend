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
        <Box sx={{p:3,display:'flex',flexDirection:'column',gap:'12px'}}>
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

const LineChart = () => {
  const [tabValue,setTabValue]=useState(0);
  const handleChange=(e,newValue)=>{
    setTabValue(newValue)
  }
  return (
    <Paper elevation={4} sx={{width:'100%'}}>
      <Box sx={{borderBottom:1,borderColor:'divider'}}>
        <Box sx={{width:'100%',ml:'20px'}}>
          <Typography variant="h6" sx={{marginTop:'8px'}}>Your work</Typography>
        </Box>
        <Tabs value={tabValue} onChange={handleChange} aria-label='task tabs'>
          <Tab label="OPEN" {...allyProps(0)}/>
          <Tab label="CLOSED" {...allyProps(1)}/>
          <Tab label="COMPLETED" {...allyProps(2)}/>
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <TaskBar/>
        <TaskBar/>
        <TaskBar/>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TaskBar/>
        <TaskBar/>
        <TaskBar/>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <TaskBar/>
        <TaskBar/>
        <TaskBar/>
      </TabPanel>
    </Paper>
  )
}

export default LineChart