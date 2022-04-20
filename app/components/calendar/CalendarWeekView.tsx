import { createStyles } from '@mantine/core';
import dayjs from 'dayjs';
import { range } from 'lodash';
import type { CalendarEntry } from '~/components/calendar/index';
import { Fragment } from 'react';

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
        bodyFirstTr: {
            borderColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderBottomStyle: 'dotted',

            td: {
                borderColor,
                borderWidth: '1px',
                borderRightStyle: 'dotted',
                fontSize: theme.fontSizes.xs,
                padding: theme.spacing.xs * 0.5,
                userSelect: 'none',
                position: 'relative',
            }
        },
        bodySecondTr: {
            td: {
                borderColor,
                borderWidth: '1px',
                borderRightStyle: 'dotted',
                fontSize: theme.fontSizes.xs,
                padding: theme.spacing.xs * 0.5,
                userSelect: 'none',
            }
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
        entry: {
            background: theme.colors.indigo,
            borderColor: theme.colors.indigo[5],
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: theme.radius.sm,
            fontSize: theme.fontSizes.xs,
            paddingTop: theme.spacing.xs * 0.1,
            paddingBottom: theme.spacing.xs * 0.1,
            paddingLeft: theme.spacing.xs * 0.5,
            paddingRight: theme.spacing.xs * 0.5,
            boxShadow: theme.shadows.xs,
            color: theme.colors.gray[4],
            cursor: 'pointer',
            position: 'absolute',
            left: 0,
        }

    };
});


interface CalendarWeekViewProps {
    entries: CalendarEntry[];
    onEntryClick: (entry: CalendarEntry) => void;
    dayStartHour: number;
    dayEndHour: number;
}

export default function CalendarWeekView(props: CalendarWeekViewProps) {
    const { classes } = useStyles();
    const hours = range(props.dayStartHour, props.dayEndHour).map((hour) => {
        return {
            hour: dayjs().hour(hour).minute(0).second(0).millisecond(0).format('HH:mm'),
            days: range(0, 7).map((weekday) => {
                return {
                    day: weekday,
                    entries: props.entries.filter((entry) => {
                        const now = dayjs().weekday(weekday).hour(hour).minute(0).second(0).millisecond(0);

                        return dayjs(entry.start).isSame(now, 'day')
                            && dayjs(entry.start).isSame(now, 'hour');
                    }),
                };
            }),

        };
    });

    return (
        <div className={classes.tableWrapper}>
            <table className={classes.table}>
                <thead>
                <tr className={classes.headTr}>
                    <th className={classes.th}></th>
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
                {hours.map((hour) => {
                    return (
                        <Fragment key={hour.hour}>
                            <tr className={classes.bodyFirstTr}>
                                <td>{hour.hour} Uhr</td>
                                {hour.days.map((day) => {
                                    return (
                                        <td key={day.day}>
                                            {day.entries.map((entry) => {
                                                return (
                                                    <div
                                                        onClick={() => props.onEntryClick(entry)}
                                                        key={entry.id}
                                                        className={classes.entry}
                                                        style={{ top: `${dayjs(entry.start).minute() / 60 * 200}%` }}>
                                                        {entry.title ? entry.title : <em>Kein Titel</em>}
                                                    </div>
                                                );
                                            })}
                                        </td>
                                    );
                                })}
                            </tr>
                            <tr className={classes.bodySecondTr}>
                                <td>&nbsp;</td>
                                {hour.days.map((day) => {
                                    return (
                                        <td key={day.day}>

                                        </td>
                                    );
                                })}
                            </tr>
                        </Fragment>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
