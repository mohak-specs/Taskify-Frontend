import { Box,Chip,Stack, Typography } from "@mui/material"
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
          p:'6px 8px',
          height:'2.5em',
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
          transition:'all ease-in-out 0.2s',
          '&:hover':{
            cursor:'pointer',
            bgcolor:'#dfdbfb',
            zIndex:999,
            boxShadow:'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'
          }
        }}
       >
        <Box
          sx={{
            maxWidth:'420px',
            flex:'1 1 55%',
          }}
        >
          <Typography variant="subtitle2" sx={{ overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{taskData?.tname}</Typography>
        </Box>
         <Box
          sx={{
            display:'flex',
            alignItems:'center',
            justifyContent:'space-around',
            gap:'4px',
            flex:'1 1 45%'
          }}
         >
           <Chip label={taskData?.status} variant='outlined' color={taskData?findColorByStatus(taskData.status):'default'}/>
           <Typography variant="overline" sx={{overflowWrap:'break-word'}}>Due date on {getDate(taskData?.dueDate)}</Typography>
         </Box>
       </Box>
      ):(
        <h1 style={{fontSize:400,maxHeight:'100%'}}>No data...</h1>
      )}
    </>
    
  )
}

export default TaskBar