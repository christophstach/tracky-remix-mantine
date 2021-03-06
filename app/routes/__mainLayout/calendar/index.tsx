import { ActionIcon, Card, Group, Tabs } from '@mantine/core';
import type { DataFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { forbidden } from 'remix-utils';
import { db } from '~/services/db.server';
import { useNavigate } from '@remix-run/react';
import type { CalendarEntry } from '~/components/calendar';
import CalendarWeekView from '~/components/calendar/CalendarWeekView';
import CalendarMonthView from '~/components/calendar/CalendarMonthView';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons';
import { useState } from 'react';
import dayjs from 'dayjs';
import { json, useLoaderData } from 'superjson-remix';


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

    return json<LoaderReturnType>({ timeEntries });
}

interface TimeEntry {
    id: string;
    text: string;
    start: Date;
    end: Date | null | undefined;
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
            <Tabs color="indigo">
                <Tabs.Tab label="Woche">
                    <Group align="stretch" sx={(theme) => {
                        return {
                            position: 'absolute',
                            top: theme.spacing.md,
                            right: theme.spacing.md,
                            gap: 0,
                        };
                    }}>
                        <ActionIcon
                            onClick={handlePreviousWeek}
                            variant="light"
                            size="md"
                            color="indigo"
                            sx={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
                        ><IconChevronsLeft size={18} /></ActionIcon>
                        <ActionIcon
                            onClick={handleNextWeek}
                            variant="light"
                            size="md"
                            color="indigo"
                            sx={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                        ><IconChevronsRight size={18} /></ActionIcon>
                    </Group>

                    <CalendarWeekView
                        noTitleText="Keine Beschreibung"
                        week={week}
                        dayStartHour={8}
                        dayEndHour={20}
                        onEntryClick={handleEntryClick}
                        entries={loaderData.timeEntries.map((entry) => {
                            return {
                                ...entry,
                                title: entry.text,
                                end: entry.end!,
                            }
                        })}
                    />
                </Tabs.Tab>

                <Tabs.Tab label="Monat">
                    <Group align="stretch" sx={(theme) => {
                        return {
                            position: 'absolute',
                            top: theme.spacing.md,
                            right: theme.spacing.md,
                            gap: 0,
                        };
                    }}>
                        <ActionIcon
                            onClick={handlePreviousMonth}
                            variant="light"
                            size="md"
                            color="indigo"
                            sx={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
                        ><IconChevronsLeft size={18} /></ActionIcon>
                        <ActionIcon
                            onClick={handleNextMonth}
                            variant="light"
                            size="md"
                            color="indigo"
                            sx={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                        ><IconChevronsRight size={18} /></ActionIcon>
                    </Group>

                    <CalendarMonthView
                        noTitleText="Keine Beschreibung"
                        month={month}
                        onEntryClick={handleEntryClick}
                        entries={loaderData.timeEntries.map((entry) => {
                            return {
                                ...entry,
                                title: entry.text,
                                end: entry.end!,
                            }
                        })}
                    />
                </Tabs.Tab>
            </Tabs>
        </Card>
    );
}
