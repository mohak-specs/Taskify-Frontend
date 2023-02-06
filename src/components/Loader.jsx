import {Backdrop, CircularProgress} from '@mui/material'
const Loader = ({isLoading}) => {
  return (
    <Backdrop
      sx={{color:'#fff',zIndex:(theme)=>theme.zIndex.drawer+10}}
      open={isLoading}
    >
      <CircularProgress color='primary' size={64}/>
    </Backdrop>
  )
}

export default Loader