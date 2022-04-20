import { Card } from '@mantine/core';
import type { DataFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { forbidden } from 'remix-utils';
import { db } from '~/services/db.server';
import { useLoaderData, useNavigate } from '@remix-run/react';
import CalendarMonthView from '~/components/calendar/CalendarMonthView';
import type { CalendarEntry } from '~/components/calendar';


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

    function handleEntryClick(entry: CalendarEntry) {
        navigate(`/time-entries/${entry.id}`);
    }

    return (
        <Card shadow="sm" p="md">
            <CalendarMonthView
                onEntryClick={handleEntryClick}
                entries={loaderData.timeEntries.map((entry) => {
                    return {
                        ...entry,
                        title: entry.text,
                    }
                })}
            />
        </Card>
    );
}
