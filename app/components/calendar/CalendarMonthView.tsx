import { createStyles } from '@mantine/core';
import dayjs from 'dayjs';
import { range } from 'lodash';
import type { CalendarEntry } from '~/components/calendar/index';

const useStyles = createStyles((theme) => {
    const borderColor = theme.colorScheme === 'light' ? theme.colors.gray[4] : theme.colors.gray[8];

    return {
        tableWrapper: {
            overflowX: 'auto',
        },
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
        week: {

            verticalAlign: 'top',
            width: 0,
        },
        day: {
            borderColor,
            padding: 0,
            borderWidth: '1px',
            borderStyle: 'solid',
            width: 'calc(100% / 7)',
            minWidth: 'calc(100% / 7)',
            maxWidth: 'calc(100% / 7)',
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
        dayNumber: {
            textAlign: 'right',
            paddingTop: theme.spacing.xs * 0.1,
            paddingBottom: theme.spacing.xs * 0.1,
            paddingLeft: theme.spacing.xs,
            paddingRight: theme.spacing.xs,
            backgroundColor: theme.colorScheme === 'light' ? theme.fn.lighten(theme.colors.gray[1], 0.5) : theme.fn.darken(theme.colors.gray[8], 0.5)
        },
        weekNumber: {
            textAlign: 'right',
            paddingTop: theme.spacing.xs * 0.1,
            paddingBottom: theme.spacing.xs * 0.1,
            paddingLeft: theme.spacing.xs,
            paddingRight: theme.spacing.xs,
            backgroundColor: theme.colorScheme === 'light' ? theme.fn.lighten(theme.colors.gray[1], 0.5) : theme.fn.darken(theme.colors.gray[8], 0.5),
            fontWeight: 'bold',
        },
        entries: {
            padding: 0,
            margin: 0,
            display: 'block',
        },
        entry: {
            display: 'flex',
            borderRadius: theme.radius.sm,
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
        entryTime: {
            ':before': {
                content: '\'•\'',
                fontWeight: 'bold',
                color: theme.colorScheme === 'light' ? theme.colors.indigo : theme.colors.indigo,
                marginRight: '0.5rem'
            }
        },
        entryTitle: {
            fontWeight: 'bold',
        },
    };
});


interface CalendarMonthViewProps {
    entries: CalendarEntry[];
    onEntryClick: (entry: CalendarEntry) => void;
    month: number;
}

export default function CalendarMonthView(props: CalendarMonthViewProps) {
    const { classes, cx } = useStyles();

    const currentMonth = dayjs()
        .month(props.month)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .startOf('month');


    const weeks = range(0, 5).map((week) => {
        const currentWeek = currentMonth.add(week, 'week')

        return {
            currentWeek,
            days: range(0, 7).map((day) => {
                return {
                    currentMonth: currentMonth.isSame(dayjs(), 'month'),
                    today: currentMonth.isSame(dayjs(), 'day'),
                    date: currentWeek.weekday(day),
                    entries: props.entries.filter((entry) => {
                        return dayjs(entry.start).isSame(currentWeek.weekday(day), 'day');
                    })
                };
            })
        };
    });

    return (
        <div className={classes.tableWrapper}>
            <table className={classes.table}>
                <thead>
                <tr className={classes.headTr}>
                    <th className={classes.th}>
                        {currentMonth.format('YYYY')}<br />
                        <small>{currentMonth.format('MMMM')}</small>
                    </th>
                    <th className={classes.th}>{currentMonth.weekday(0).format('dddd')}</th>
                    <th className={classes.th}>{currentMonth.weekday(1).format('dddd')}</th>
                    <th className={classes.th}>{currentMonth.weekday(2).format('dddd')}</th>
                    <th className={classes.th}>{currentMonth.weekday(3).format('dddd')}</th>
                    <th className={classes.th}>{currentMonth.weekday(4).format('dddd')}</th>
                    <th className={classes.th}>{currentMonth.weekday(5).format('dddd')}</th>
                    <th className={classes.th}>{currentMonth.weekday(6).format('dddd')}</th>
                </tr>
                </thead>
                <tbody>
                {weeks.map((week, weekIndex) => {
                    return (
                        <tr key={weekIndex} className={classes.bodyTr}>
                            <td className={classes.week}>
                                <div className={classes.weekNumber}>
                                    {week.currentWeek.week()}
                                </div>

                            </td>
                            {week.days.map((day, dayIndex) => {
                                return (
                                    <td
                                        key={dayIndex}
                                        className={cx(
                                            classes.day,
                                            day.currentMonth ? classes.dayCurrentMonth : classes.dayOtherMonth,
                                            day.today ? classes.today : undefined
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
        </div>
    );
}
