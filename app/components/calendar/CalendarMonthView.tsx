import { createStyles } from '@mantine/core';
import dayjs from 'dayjs';
import { range } from 'lodash';
import { CalendarEntry } from '~/components/calendar/index';

const useStyles = createStyles((theme) => {
    const borderColor = theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.gray[8];

    return {
        table: {
            borderColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderCollapse: 'collapse',
            width: '100%',
            fontSize: theme.fontSizes.sm,
        },
        headTr: {
            borderColor,
            borderWidth: '1px',
            borderStyle: 'solid',
        },
        bodyTr: {
            borderColor,
            borderWidth: '1px',
            borderStyle: 'solid',
        },
        th: {
            borderColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            paddingTop: theme.spacing.xs * 0.7,
            paddingBottom: theme.spacing.xs * 0.7,
            paddingLeft: theme.spacing.xs,
            paddingRight: theme.spacing.xs,
            color: theme.colorScheme === 'light' ? theme.colors.gray[7] : theme.colors.gray[4],
        },
        day: {
            borderColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            width: 'calc(100% / 7)',
            height: '140px',
            verticalAlign: 'top'
        },
        dayInner: {
            paddingTop: theme.spacing.xs * 0.7,
            paddingBottom: theme.spacing.xs * 0.7,
            paddingLeft: theme.spacing.xs * 0.3,
            paddingRight: theme.spacing.xs * 0.3,
        },
        dayCurrentMonth: {
            color: theme.colorScheme === 'light' ? theme.colors.gray[7] : theme.colors.gray[4],
        },
        dayOtherMonth: {
            color: theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.gray[8]
        },
        today: {
            backgroundColor: theme.colorScheme === 'light' ? theme.colors.indigo[0] : theme.fn.darken(theme.colors.indigo[9], 0.8),
        },
        notToday: {},
        dayNumber: {
            textAlign: 'right',
            paddingTop: theme.spacing.xs * 0.1,
            paddingBottom: theme.spacing.xs * 0.1,
            paddingLeft: theme.spacing.xs,
            paddingRight: theme.spacing.xs,
            backgroundColor: theme.colorScheme === 'light' ? theme.fn.lighten(theme.colors.gray[1], 0.5) : theme.fn.darken(theme.colors.gray[8], 0.5)
        },
        entries: {
            padding: 0,
            margin: 0,
            display: 'block',
        },
        entry: {
            display: 'flex',
            borderRadius: theme.radius.xs,
            marginBottom: theme.spacing.xs * 0.3,
            fontSize: theme.fontSizes.xs,
            gap: theme.spacing.xs,
            color: theme.colorScheme === 'light' ? theme.colors.gray[7] : theme.colors.gray[4],
            paddingTop: theme.spacing.xs * 0.1,
            paddingBottom: theme.spacing.xs * 0.1,
            paddingLeft: theme.spacing.xs * 0.5,
            paddingRight: theme.spacing.xs * 0.5,
            cursor: 'pointer',

            '&:hover': {
                background: theme.colorScheme === 'light' ? theme.colors.gray[1] : theme.colors.gray[8],
            }
        },

        entryTime: {},
        entryTitle: {
            fontWeight: 'bold',
        },
    };
});



interface CalendarProps {
    entries: CalendarEntry[];
    onEntryClick: (entry: CalendarEntry) => void;
}

export default function CalendarMonthView(props: CalendarProps) {
    const { classes, cx } = useStyles();

    const firstWeek = dayjs().startOf('month').week();
    const lastWeek = dayjs().endOf('month').week();
    const weeks = range(firstWeek, lastWeek + 1).map((week) => {
        return {
            week,
            days: range(0, 7).map((day) => {
                return {
                    day,
                    currentMonth: dayjs().week(week).weekday(day).month() === dayjs().month(),
                    today: dayjs().week(week).weekday(day).isSame(dayjs(), 'day'),
                    date: dayjs().week(week).weekday(day),
                    entries: props.entries.filter((entry) => {
                        return dayjs(entry.start).isSame(dayjs().week(week).weekday(day), 'day');
                    })
                };
            })
        };
    });

    return (
        <table className={classes.table}>
            <thead>
            <tr className={classes.headTr}>
                <th className={classes.th}>{dayjs().weekday(0).format('dddd')}</th>
                <th className={classes.th}>{dayjs().weekday(1).format('dddd')}</th>
                <th className={classes.th}>{dayjs().weekday(2).format('dddd')}</th>
                <th className={classes.th}>{dayjs().weekday(3).format('dddd')}</th>
                <th className={classes.th}>{dayjs().weekday(4).format('dddd')}</th>
                <th className={classes.th}>{dayjs().weekday(5).format('dddd')}</th>
                <th className={classes.th}>{dayjs().weekday(6).format('dddd')}</th>
            </tr>
            </thead>
            <tbody>
            {weeks.map((week) => {
                return (
                    <tr key={week.week} className={classes.bodyTr}>
                        {week.days.map((day) => {
                            return (
                                <td
                                    key={day.day}
                                    className={cx(
                                        classes.day,
                                        day.currentMonth ? classes.dayCurrentMonth : classes.dayOtherMonth,
                                        day.today ? classes.today : classes.notToday
                                    )}>
                                    <div className={classes.dayNumber}>
                                        {day.date.format('DD')}
                                    </div>
                                    <div className={classes.dayInner}>

                                        <ul className={classes.entries}>
                                            {day.entries.map((entry) => {
                                                return (
                                                    <li
                                                        key={entry.id}
                                                        className={classes.entry}
                                                        onClick={() => props.onEntryClick(entry)}>
                                                        <div className={classes.entryTime}>
                                                            {dayjs(entry.start).format('HH:mm')}
                                                        </div>
                                                        <div className={classes.entryTitle}>
                                                            {entry.title}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}
