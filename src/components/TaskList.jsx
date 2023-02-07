import { useEffect, useMemo, useState } from "react"
import { useNavigate} from "react-router-dom"
import {toast} from 'react-toastify'
import axios from "axios"
import {Stack,Badge,Typography, Select, FormControl, InputLabel, MenuItem,Autocomplete,TextField} from '@mui/material'
import MailIcon from '@mui/icons-material/Mail';
import { DataGrid } from "@mui/x-data-grid"
import dayjs from "dayjs"
import fetchUser from "../utils/fetchUser"
import Loader from "./Loader"
import { useTitle } from "../utils/useTitle"

const TaskList = () => {
  const user=fetchUser()
  const {token,data}=user?user:{token:''}
  const navigate=useNavigate()
  const [selectedOption,setSelectedOption]=useState('All Tasks')
  const [taskData,setTaskData]=useState(null)
  const [isLoading,setIsLoading]=useState(false)
  const [pageSize,setPageSize]=useState(15)

  const handleRowClick=(params)=>{
    navigate(`/tasks/${params.row._id}`)
  }


  const columns=useMemo(()=>[
    {
      field:'tname',
      headerName:'Name',
      headerClassName: 'task__list__header',
      sortable:false,
      width:250,
      renderCell:params=><Typography variant="inherit" sx={{overflowWrap:'break-word'}}>{params.row?.tname}</Typography>
    },
    {
      field:'tdesc',
      headerName:'Description',
      headerClassName: 'task__list__header',
      width:300,
      renderCell:params=><Typography variant="inherit" sx={{overflowWrap:'break-word'}}>{params.row?.tdesc}</Typography>
    },
    {
      field:'status',
      headerName:'Status',
      headerClassName: 'task__list__header',
      width:120,
    },
    {
      field:'author',
      headerName:'Created by',
      type:String,
      headerClassName: 'task__list__header',
      width:220,
      valueGetter:(params)=>params.row?.author?.name
    },
    {
      field:'startDate',
      headerName:'Start Date',
      headerClassName: 'task__list__header',
      width:110,
      renderCell:params=>dayjs(params.row?.startDate).format('DD/MM/YYYY')
    },
    {
      field:'dueDate',
      headerName:'Due Date',
      headerClassName: 'task__list__header',
      width:110,
      renderCell:params=>dayjs(params.row?.dueDate).format('DD/MM/YYYY')
    },
    {
      field:'assignTo',
      headerName:'Assigned to',
      headerClassName: 'task__list__header',
      width:320,
      type:String,
      valueGetter:(params)=>params.row?.assignTo?.map((user)=>user.name).join(', ')
    },
    {
      width:60,
      renderCell:(params)=>params.row?.unread!==0 && (
        <Badge sx={{mx:'auto'}} badgeContent={params.row?.unread} color='error'>
                <MailIcon color="action"/>
        </Badge>
      )
    }
  ])
  const getAllTasks=async(authToken)=>{
    try{
      setIsLoading(true)
      const res=await axios.get(`/tasks?byLoggedUser=${selectedOption!=='All Tasks'?true:''}`,{headers:{Authorization:`Bearer ${authToken}`}})
      setTaskData(res.data)
    }catch(err){
      toast.error(err?.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }
  useTitle('Task List')
  useEffect(()=>{
    if(token){
      getAllTasks(token)
    }
  },[selectedOption])
  return (
    <div>
      <Loader isLoading={isLoading}/>
      {/* <Navbar title={'Task List'}/> */}
      <div className="task__list__container">
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <FormControl sx={{width:'180px'}}>
              <InputLabel id="filter-by-assignee">Filter Task</InputLabel>
              <Select
                labelId="filter-by-assignee"
                id="filter-by-assignee"
                value={selectedOption}
                label='Filter Task'
                onChange={(e)=>setSelectedOption(e.target.value)}
              >
                <MenuItem value='All Tasks'>All Tasks</MenuItem>
                <MenuItem value='Created By You'>Created By You</MenuItem>
              </Select>
          </FormControl>
        </Stack>
        <DataGrid
          columns={columns}
          rows={taskData?taskData.tasks:{}}
          getRowId={row=>row?._id}
          getRowHeight={()=>'auto'}
          density='comfortable'
          rowsPerPageOptions={[15,30,50]}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize)=>setPageSize(newPageSize)}
          disableSelectionOnClick
          onRowClick={handleRowClick}
          getRowClassName={(params)=>`datagrid__row ${params.row.isLate?'late':''}`}
          getRowSpacing={params=>({
            top:params.isFirstVisible?5:2,
            bottom:params.isLastVisible?0:2
          })}
          sx={{
            boxShadow:2,
            border:2,
            borderColor:'#1976d2',
            '& .MuiDataGrid-cell':{
              fontWeight:300,
            },
            '& .MuiDataGrid-cell:hover':{
              color:'#1976d2',
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9f9f9",
              color: "#1976d2",
              fontSize: 20,
            },
            "& .MuiDataGrid-virtualScrollerRenderZone": {
              "& .MuiDataGrid-row": {
                "&:nth-child(2n)": { backgroundColor: "rgba(235, 235, 235, .7)" }
              },
              
            }
          }}
        />
      </div>
    </div>
  )
}

export default TaskList

{/* <Stack direction='row' spacing={1} sx={{display:'flex',flexWrap:'wrap',justifyContent:'flex-start',alignContent:'center'}}>
{params.row?.assignTo.slice(0,2).map((user)=>(
  <Chip key={user?._id} label={user?.name} color={params.row?.isLate?'error':'primary'} variant="outlined"/>
))}
{params.row?.assignTo.length>2?<Typography variant="caption" color='primary'>{params.row?.assignTo.length-2}+more</Typography>:''}
</Stack> */}
