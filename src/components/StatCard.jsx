import {Paper} from '@mui/material'
const StatCard = (props) => { 
  return (
    <Paper elevation={4} className="stat__card" sx={{borderRadius:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div className="stat__content">
            <h1>{props.statData ? props.statData : 0}</h1>
            <p>{props.statType}</p>
        </div>
        <div className="icon">
            <props.icon size={48}/>
        </div>
    </Paper>
  )
}


export default StatCard