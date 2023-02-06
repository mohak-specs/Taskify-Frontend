import { Box,Chip,Divider,Stack, Typography } from "@mui/material"
import {useNavigate} from 'react-router-dom'
import {findColorByStatus} from '../utils/statusChipData'
import {getDate} from '../utils/getDate'
const TaskBar = ({taskData}) => {
  const navigate=useNavigate()
  return (
    <>
      {Object.keys(taskData).length!==0?(
        <Box 
          onClick={()=>navigate(`/tasks/${taskData?._id}`)}
          sx={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',  
          width:'100%',
          bgcolor:'rgba(255, 255, 249,0.7)',
          borderRadius:'8px',
          p:'0 8px',
          height:'2.5em',
          transition:'all ease-in-out 0.2s',
          '&:hover':{
            cursor:'pointer',
            bgcolor:'#dfdbfb',
            boxShadow:'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'
          }
        }}
       >
         <Stack direction='row'>
           <Typography variant="subtitle2">{taskData?.tname}</Typography>
         </Stack>
         <Stack 
           direction='row' 
           alignItems='center'
           justifyContent='space-evenly'
           spacing={2}
         >
           <Chip label={taskData?.status} variant='outlined' color={taskData?findColorByStatus(taskData.status):'default'}/>
           <Typography variant="overline" sx={{overflowWrap:'break-word'}}>Due date on {getDate(taskData?.dueDate)}</Typography>
         </Stack>
       </Box>
      ):(
        <h1 style={{fontSize:400}}>No data...</h1>
      )}
    </>
    
  )
}

export default TaskBar