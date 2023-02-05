import { Link, useNavigate } from "react-router-dom"
import {AiOutlineMenu,AiOutlineDashboard} from 'react-icons/ai'
import {RxCross1} from 'react-icons/rx'
import {toast} from 'react-toastify'
import {FaTasks} from 'react-icons/fa'
import {MdCreate,MdAccountCircle} from 'react-icons/md'
const Sidebar = () => {
    const navigate=useNavigate()
    const onLogout=()=>{
        localStorage.removeItem('user')
        toast.success('You have succesfully logged out.')
        navigate('/')
    }
    return (
        <div className="home__sidebar">
            <div className="sidebar__title">
                <Link to='/dashboard'>
                    <h1>Taski<span className='title__blue'>Fy</span></h1>
                </Link>
            </div>
            <hr/>
            <div className="sidebar__links">
            <div className="sidebar__upper">
            <Link to='/dashboard'>
                <div className={`sidebar__btn`}>
                <p>Dashboard</p>
                <AiOutlineDashboard/>
                </div>
            </Link>
            <Link to='/tasks'>
                <div className={`sidebar__btn`}>
                <p>Tasks</p>
                <FaTasks/>
                </div>
            </Link>
            <Link to='/create'>
                <div className={`sidebar__btn`}>
                <p className="--small__text">Create Task</p>
                <MdCreate/>
                </div>
            </Link>
            <Link to='/account'>
                <div className={`sidebar__btn`}>
                <p>Account</p>
                <MdAccountCircle/>
                </div>
            </Link>
            </div>
            <button className="logout__btn" onClick={onLogout}>Logout</button>
            </div>
        </div>
    )
}

export default Sidebar