import {AppBar, Box, Divider, IconButton,Drawer,List,ListItemText, Menu, MenuItem, Toolbar, Typography, ListItemButton, Tabs, Tab,Tooltip,Avatar} from '@mui/material'
import {Menu as MenuIcon,ExitToAppOutlined} from '@mui/icons-material'
import {useLocation, useNavigate} from 'react-router-dom'
import fetchUser from '../utils/fetchUser'
import { useState } from 'react'
import { toast } from 'react-toastify'

const pages=[
    {
        id:0,
        name:'Dashboard',
        path:'/dashboard'
    },
    {
        id:1,
        name:'Tasks',
        path:'/tasks'
    },
    {
        id:2,
        name:'Create Task',
        path:'/create'
    },
    {
        id:3,
        name:'Account',
        path:'/account'
    },
]

const drawerWidth=240;

const Navbar = (props) => {
    const {window}=props;
    const user=fetchUser()
    const {data}=user?user:{data:''}
    const navigate=useNavigate();
    const {pathname}=useLocation();
    const [mobileOpen,setMobileOpen]=useState(false);
    const [anchorElUser,setAnchorElUser]=useState(null)
    const open=Boolean(anchorElUser);
    const handleDrawerToggle=()=>setMobileOpen(!mobileOpen)
    
    const currentTab=pages.find((page)=>page.path===`/${pathname.split("/")?.pop()}`)
    const value=currentTab?currentTab?.id:null

    const handleTabChange=(e,newValue)=>{
        const selectedTab=pages.find((page)=>page.id===newValue);
        navigate(selectedTab.path)
    }
    const handleOpenAccount=(e)=>{
        setAnchorElUser(e.currentTarget);
    }
    const handleCloseAccount=()=>{
        setAnchorElUser(null);
    }
    const handleAccountClick=()=>{
        setAnchorElUser(null)
        navigate('/account')
    }
    const handleLogout=()=>{
        setAnchorElUser(null)
        localStorage.clear()
        navigate('/',{replace:true})
        toast.success('You have successfully logged out')
    }
    const drawer=(
        <div>
            <Toolbar/>
            <Divider/>
            <List>
                {pages.map((page,i)=>(
                    <ListItemButton key={i} onClick={()=>{
                        navigate(page.path)
                        handleDrawerToggle()
                    }}>
                        <ListItemText key={i} primary={page.name}/>
                    </ListItemButton>
                ))}
            </List>
        </div>
    )
    const container=window!==undefined?()=>window().document.body:undefined;
    return (
        <Box sx={{display:'flex',marginBottom:'64px'}}>
            <AppBar
                position='fixed'
                sx={{
                    width:{sm:`calc(100%-${drawerWidth}px)`},
                    ml:{sm:`${drawerWidth}px`},
                    backgroundImage:'linear-gradient(to right, #485563, #29323c)'
                }}
            >
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        edge='start'
                        onClick={handleDrawerToggle}
                        sx={{mr:2,display:{sm:'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <div className="nav__container">
                        <div onClick={()=>{
                            navigate('/dashboard')
                            }}>
                            <Typography variant='h4' className='nav__title'>Taski<span style={{color:'#1976d2'}}>Fy</span></Typography>
                        </div>
                        <Tabs className='nav__links' value={value} onChange={handleTabChange} aria-label='nav-tabs'>
                            {pages.map((page)=>(
                                <Tab sx={{color:'#fff'}} key={page.id} label={page.name} value={page.id} aria-label={page.name}/>   
                            ))}
                        </Tabs>
                        <Tooltip title="Account settings">
                            <IconButton
                                onClick={handleOpenAccount}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                            <Avatar sx={{color:'#000',bgcolor:'#fff', width: 32, height: 32 }}>{data?.name?.[0]}</Avatar>
                        </IconButton>
                        </Tooltip>
                    </div>
                </Toolbar>
                <Menu
                    anchorEl={anchorElUser}
                    id="account-menu"
                    open={open}
                    onClose={handleCloseAccount}
                    onClick={handleCloseAccount}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                            },
                            '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            },
                    },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleCloseAccount}>
                    Logged in as {data?.name}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleAccountClick}>
                    <Avatar /> My account
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <Avatar><ExitToAppOutlined/></Avatar> Logout
                </MenuItem>
            </Menu>
            </AppBar>
            <Box
                component='nav'
                sx={{width:{sm:drawerWidth},flexShrink:{sm:0}}}
                aria-label='navbar-menu'
            >
                <Drawer
                    container={container}
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted:true
                    }}
                    sx={{
                        display:{xs:'block',sm:'none'},
                        '& .MuiDrawer-paper':{boxSizing:'border-box',width:drawerWidth}
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
  )
}
export default Navbar