import { useState } from 'react'
import {toast} from 'react-toastify'
import { useNavigate,NavLink,Outlet } from "react-router-dom"
import Loader from '../components/Loader'
const AuthPage=()=>{
    const [isLoading,setIsLoading] = useState(false)
    return(
        <div className="container">
            <Loader isLoading={isLoading}/>
            <div className="layout">
                 <nav className='layout__nav' style={{backgroundColor:'Menu'}}>
                    <NavLink to={'/'} className="nav__title__landing">Taski<span className='title__blue'>Fy</span></NavLink>
                </nav>
            </div>
            <div className='auth-form'>
                <Outlet context={[setIsLoading]}/>
            </div>
        </div>
    )
}

export default AuthPage;