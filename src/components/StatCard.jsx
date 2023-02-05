import {Paper} from '@mui/material'
const StatCard = (props) => {
  return (
    <Paper elevation={6} className="stat__card" sx={{borderRadius:'8px'}}>
        <div className="stat__content">
            <h1>{props.statData}</h1>
            <p>{props.statType}</p>
        </div>
        <div className="icon">
            <props.icon size={48}/>
        </div>
    </Paper>
  )
}


export default StatCard