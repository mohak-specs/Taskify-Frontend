import { Navigate } from "react-router-dom"
import fetchUser from "../utils/fetchUser"


const ProtectedRoute = ({children}) => {
  const user=fetchUser()
  if(!user){
    <Navigate to='/'/>
  }
  return children;
}

export default ProtectedRoute