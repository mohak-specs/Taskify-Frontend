const findColorByStatus=(status)=>{
    const statusChip=[
        {
            status:"OPEN",
            color:'default'
        },
        {
            status:"IN PROGRESS",
            color:'secondary'
        },
        {
            status:"ON HOLD",
            color:'warning'
        },
        {
            status:"CANCELLED",
            color:'error'
        },
        {
            status:"CLOSED",
            color:'success'
        }
    ]
    const found=statusChip.find((data)=>data.status===status)
    return found.color;
}

export {findColorByStatus}