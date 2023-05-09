import { useEffect, useState } from "react";
import { Outlet, useNavigate} from "react-router-dom"
import { toast } from "react-toastify";
import fetchUser from "../utils/fetchUser";


// Components
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";

const Home = () => {
  const user=fetchUser();
  const navigate=useNavigate();
  const [isClosed,setIsClosed]=useState(false)
  useEffect(()=>{
    if(user && !user?.data?.passwordChanged){
      navigate('/first')
      toast.info('Change your password and you may change your username too.',{
        toastId: 'info1',
      })
    }
  },[])

  const onClickView=()=>{
    // navigate('/tasks/123')
    getAllTasks(token)
  }
  const {token,data}=user?user:{token:'',data:''}
  const getAllTasks=async(authToken)=>{
    try{
      const res=await axios.get('/tasks',{headers:{Authorization:`Bearer ${authToken}`}})
      console.log(res.data)
    }catch(err){
      toast.error(err?.response?.data?.message)
    }
  }
  return (
    <div className="home__container">
      {/* <Sidebar/> */}
      <div className="home__screen">
        <Navbar/>
        <div className="home__content">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Home