import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

const getDate=(isoDate)=>{
    return dayjs(isoDate).format('LL')
}

const getDateTime=(isoDate)=>{
    return dayjs(isoDate).format('LLL')
}

export {getDate,getDateTime};