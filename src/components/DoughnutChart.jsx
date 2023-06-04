import { Divider, Paper, Typography } from '@mui/material';
import ChartDataLabels from "chartjs-plugin-datalabels";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Doughnut} from 'react-chartjs-2'

ChartJS.register(ArcElement,Tooltip,Legend,ChartDataLabels);

const DoughnutChart = ({stats}) => {
    const labels=[]
    const arrData=[]
    if(stats?.numOpenedTasks){
        labels.push('Open')
        arrData.push(stats?.numOpenedTasks)
    }
    if(stats?.numProgressTasks){
        labels.push('In Progress')
        arrData.push(stats?.numProgressTasks)
    } 
    if(stats?.numHoldTasks){
        labels.push('On Hold')
        arrData.push(stats?.numHoldTasks)
    } 
    if(stats?.numClosedTasks){
        labels.push('Closed')
        arrData.push(stats?.numClosedTasks)
    } 
    const data={
        labels,
        datasets:[
            {
                label:'Number of Tasks',
                data:arrData,
                backgroundColor:[
                    'rgba(255, 99, 132, 0.4)',
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(255, 206, 86, 0.4)',
                    'rgba(75, 192, 192, 0.4)',
                ],
                borderColor:[
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth:2,            
            }
        ]
    }
    const options={
        cutoutPercentage: 50,
        responsive:true,
        plugins:{
            legend:{
                position:'bottom'
            },
            datalabels: {
                formatter: (value, ctx) => {
                    let sum = 0;
                    let dataArr = ctx.chart.data.datasets[0].data;
                    dataArr.map(data => {
                        sum += data;
                    });
                    let percentage = (value*100 / sum).toFixed(2)+"%";
                    return percentage;
                },
                color: '#000',
            }
        }
    }
    return (
        <Paper elevation={4} sx={{
            p:'8px',
            width:'320px'
        }}>
            <Typography variant='h6' component='body'>Number of status</Typography>
            <Divider sx={{mb:'2px'}}/>
            {labels.length!==0?(
                <Doughnut data={data} options={options}/>
            ):(
                <Typography variant='h5'>No data...</Typography>
            )}
        </Paper>
    )
}

export default DoughnutChart