import moment from 'moment'
import {FORMAT_DATE, FORMATE_DATE_NO_HOURS} from '../constants'

export const formatDate = (date: string, format: string = FORMAT_DATE) => {
  return moment(date).format(format)
}

export const formatDateNoHours = (date: string, format: string = FORMATE_DATE_NO_HOURS) => {
  return moment(date).format(format)
}
