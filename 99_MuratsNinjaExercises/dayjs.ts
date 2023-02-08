import dayjs from 'dayjs'

Number(dayjs().subtract(7, 'month')) //?

const now = new Date()
Number(new Date(now.setMonth(now.getMonth() - 7))) //?
