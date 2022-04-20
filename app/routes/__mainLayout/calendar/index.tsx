import { Badge, Box, Button, Card, Group, Tabs } from '@mantine/core';
import type { DataFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { forbidden } from 'remix-utils';
import { db } from '~/services/db.server';
import { useLoaderData, useNavigate } from '@remix-run/react';
import type { CalendarEntry } from '~/components/calendar';
import CalendarWeekView from '~/components/calendar/CalendarWeekView';
import CalendarMonthView from '~/components/calendar/CalendarMonthView';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons';
import { useState } from 'react';
import dayjs from 'dayjs';


export async function loader({ request }: DataFunctionArgs) {
    const userId = await authenticator.isAuthenticated(request);

    if (!userId) {
        throw forbidden('Not allowed');
    }

    const timeEntries = await db.timeEntry.findMany({
        where: {
            userId,
            NOT: {
                end: null,
            }
        },
        orderBy: {
            start: 'desc'
        }
    });

    return { timeEntries };
}

interface TimeEntry {
    id: string;
    text: string;
    start: string;
    end: string;
}

interface LoaderReturnType {
    timeEntries: TimeEntry[];
}

export default function () {
    const navigate = useNavigate();
    const loaderData = useLoaderData<LoaderReturnType>();
    const [ week, setWeek ] = useState(dayjs().week());
    const [ month, setMonth ] = useState(dayjs().month());

    function handleEntryClick(entry: CalendarEntry) {
        navigate(`/time-entries/${entry.id}`);
    }

    function handlePreviousWeek() {
        setWeek(week - 1);
    }

    function handleNextWeek() {
        setWeek(week + 1);
    }

    function handlePreviousMonth() {
        setMonth(month - 1);
    }

    function handleNextMonth() {
        setMonth(month + 1);
    }

    return (
        <Card shadow="sm" p="md" sx={{ position: 'relative' }}>
            <Tabs>
                <Tabs.Tab label="Woche">
                    <Group align="stretch" sx={(theme) => {
                        return {
                            position: 'absolute',
                            top: theme.spacing.md,
                            right: theme.spacing.md
                        };
                    }}>
                        <Button
                            onClick={handlePreviousWeek}
                            variant="light"
                            size="xs"
                            leftIcon={<IconChevronsLeft size={18} />}
                        >Zurück</Button>
                        <Button
                            onClick={handleNextWeek}
                            variant="light"
                            size="xs"
                            rightIcon={<IconChevronsRight size={18} />}
                        >Vor</Button>
                    </Group>

                    <CalendarWeekView
                        week={week}
                        dayStartHour={8}
                        dayEndHour={20}
                        onEntryClick={handleEntryClick}
                        entries={loaderData.timeEntries.map((entry) => {
                            return {
                                ...entry,
                                title: entry.text,
                            }
                        })}
                    />
                </Tabs.Tab>

                <Tabs.Tab label="Monat">
                    <Group align="stretch" sx={(theme) => {
                        return {
                            position: 'absolute',
                            top: theme.spacing.md,
                            right: theme.spacing.md
                        };
                    }}>
                        <Button
                            onClick={handlePreviousMonth}
                            variant="light"
                            size="xs"
                            leftIcon={<IconChevronsLeft size={18} />}
                        >Zurück</Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '150px', justifyContent: 'center' }}>
                            <strong>{dayjs().month(month).format('MMMM YYYY')}</strong>
                        </Box>
                        <Button
                            onClick={handleNextMonth}
                            variant="light"
                            size="xs"
                            rightIcon={<IconChevronsRight size={18} />}
                        >Vor</Button>
                    </Group>

                    <CalendarMonthView
                        month={month}
                        onEntryClick={handleEntryClick}
                        entries={loaderData.timeEntries.map((entry) => {
                            return {
                                ...entry,
                                title: entry.text,
                            }
                        })}
                    />
                </Tabs.Tab>
            </Tabs>


        </Card>
    );
}
