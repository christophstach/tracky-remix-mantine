import { Calendar, Event } from 'react-big-calendar';
import { dayjsLocalizer } from '~/localizers/dayjs';
import styles from 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card } from '@mantine/core';
import type { DataFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { forbidden } from 'remix-utils';
import { db } from '~/services/db.server';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { useCallback, useMemo } from 'react';

const localizer = dayjsLocalizer();

export function links() {
    return [
        {
            rel: 'stylesheet',
            href: styles,
        },
    ];
}

export async function loader({ request }: DataFunctionArgs) {
    const userId = await authenticator.isAuthenticated(request);

    if (!userId) {
        throw forbidden('Not allowed');
    }

    const timeEntries = await db.timeEntry.findMany({
        where: {
            userId
        },
        orderBy: {
            start: 'desc'
        }
    });

    return { timeEntries };
}

interface LoaderReturnType {
    timeEntries: {
        id: string;
        text: string;
        start: string;
        end: string | null | undefined;
    }[];
}


export default function () {
    const navigate = useNavigate();
    const loaderData = useLoaderData<LoaderReturnType>();
    const events: Event[] = loaderData.timeEntries.map(({ id, text, start, end }) => ({
        id,
        title: text,
        start: new Date(start),
        end: end ? new Date(end) : undefined,
    }));

    const components = useMemo(() => ({
        toolbar: () => null,
    }), []);

    const handleSelectEvent = useCallback(
        (event) => {
            navigate(`/time-entries/${event.id}`);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <Card shadow="sm" p="md">
            <Calendar
                components={components}
                defaultView="week"
                events={events}
                localizer={localizer}
                onSelectEvent={handleSelectEvent}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 700 }}
            />
        </Card>
    );
}
