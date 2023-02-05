import loader from '../assets/loader.svg'
import {Backdrop, CircularProgress} from '@mui/material'
const Loader = ({isLoading}) => {
  return (
    // <div className={`loader__container ${isLoading ? '':'hidden'}`}>
    //     <img src={loader} alt='Loading...' className='loader'/>
    //     <h2>Loading...</h2>
    // </div>
    <Backdrop
      sx={{color:'#fff',zIndex:(theme)=>theme.zIndex.drawer+10}}
      open={isLoading}
    >
      <CircularProgress color='secondary' size={64}/>
    </Backdrop>
  )
}

export default Loader