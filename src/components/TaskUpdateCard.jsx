import { Typography,Box, Divider } from "@mui/material"
import { DataGrid,GridToolbar } from "@mui/x-data-grid"
import { useMemo, useState } from "react"
import { getDate, getDateTime } from "../utils/getDate"

const TaskUpdateCard = ({taskUpdates}) => {
  const [pageSize,setPageSize]=useState(10)
  const columns=useMemo(()=>[
    {
      field:'updatedBy',
      headerName:'Updated By',
      width:140,
      valueGetter:(params)=>params?.row?.updatedBy?.name
    },
    {
      field:'updateReason',
      headerName:'Updation Reason',
      width:220,
    },
    {
      field:'committedDate',
      headerName:'Committed Date',
      width:120,
      valueGetter:params=>getDate(params?.row?.committedDate)
    },
    {
      field:'updateStatus',
      headerName:'Updated Status',
      width:120
    },
    {
      field:'createdAt',
      headerName:'Posted On',
      width:120,
      valueGetter:params=>getDateTime(params?.row?.createdAt)
    }
  ])
  return (
    <Box sx={{p:'6px',height:'80vh'}}>
      <Typography variant='inherit' component='h1'>Task Updates</Typography>
      <Divider/>
      <DataGrid
        rows={taskUpdates?taskUpdates:[]}
        getRowId={row=>row?._id}
        getRowHeight={()=>'auto'}
        columns={columns}
        disableSelectionOnClick
        rowsPerPageOptions={[10,30,50]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize)=>setPageSize(newPageSize)}
        components={{Toolbar:GridToolbar}}
        getRowSpacing={params=>({
          top:params.isFirstVisible?0:2,
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
              color:'#1976d2'
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9f9f9",
              color: "#1976d2",
              fontSize: 14,
            },
            "& .MuiDataGrid-virtualScrollerRenderZone": {
              "& .MuiDataGrid-row": {
                "&:nth-child(2n)": { backgroundColor: "rgba(235, 235, 235, .7)" }
              },
            } 
        }}
      />
    </Box>
  )
}

export default TaskUpdateCard