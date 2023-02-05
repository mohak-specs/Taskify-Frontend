import dayjs from 'dayjs'

const getDate=(isoDate)=>{
    return dayjs(isoDate).format('DD-MM-YYYY')
}

const getDateTime=(isoDate)=>{
    return dayjs(isoDate).format('DD-MM-YYYY HH:MM')
}

export {getDate,getDateTime};