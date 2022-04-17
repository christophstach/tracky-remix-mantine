import { DateLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';

const weekRangeFormat = ({ start, end }: any, culture: any, local: any) => {
    return (
        local.format(start, 'MMMM DD', culture) +
        ' – ' +
        local.format(end, local.eq(start, end, 'month') ? 'DD' : 'MMMM DD', culture)
    );
}

const dateRangeFormat = ({ start, end }: any, culture: any, local: any) => {
    return local.format(start, 'HH', culture) + ' – ' + local.format(end, 'HH', culture)
}

const timeRangeFormat = ({ start, end }: any, culture: any, local: any) => {
    return local.format(start, 'HH:mm', culture) + ' – ' + local.format(end, 'HH:mm', culture);
}

const timeRangeStartFormat = ({ start }: any, culture: any, local: any) => {
    return local.format(start, 'HH:mm', culture) + ' – ';
}

const timeRangeEndFormat = ({ end }: any, culture: any, local: any) => {
    return ' – ' + local.format(end, 'HH:mm', culture);
}

export const formats = {
    dateFormat: 'DD',
    dayFormat: 'DD ddd',
    weekdayFormat: 'ddd',

    selectRangeFormat: timeRangeFormat,
    eventTimeRangeFormat: timeRangeFormat,
    eventTimeRangeStartFormat: timeRangeStartFormat,
    eventTimeRangeEndFormat: timeRangeEndFormat,

    timeGutterFormat: 'HH:mm',

    monthHeaderFormat: 'MMMM YYYY',
    dayHeaderFormat: 'dddd MMM DD',
    dayRangeHeaderFormat: weekRangeFormat,
    agendaHeaderFormat: dateRangeFormat,

    agendaDateFormat: 'ddd MMM DD',
    agendaTimeFormat: 'HH:mm',
    agendaTimeRangeFormat: timeRangeFormat,
}


export const dayjsLocalizer = () => {
    let locale = (m: any, c: any) => (c ? m.locale(c) : m)

    return new DateLocalizer({
        formats,
        firstOfWeek(culture) {
            let data = dayjs.localeData()
            return data ? data.firstDayOfWeek() : 0
        },

        format(value, format, culture) {
            return locale(dayjs(value), culture).format(format)
        },
    })
}
