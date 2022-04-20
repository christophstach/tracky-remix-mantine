import { Card } from '@mantine/core';
import type { DataFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { forbidden } from 'remix-utils';
import { db } from '~/services/db.server';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import stylesCommon from '@fullcalendar/common/main.min.css';
import stylesDayGrid from '@fullcalendar/daygrid/main.min.css';
import stylesTimeGrid from '@fullcalendar/timegrid/main.min.css';

export function links() {
    return [
        {
            rel: 'stylesheet',
            href: stylesCommon,
        },
        {
            rel: 'stylesheet',
            href: stylesDayGrid,
        },
        {
            rel: 'stylesheet',
            href: stylesTimeGrid,
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
            userId,
            NOT: {
                end: null
            }
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
        end: string;
    }[];
}


export default function () {
    const navigate = useNavigate();
    const loaderData = useLoaderData<LoaderReturnType>();

    const handleEventClick = useCallback(
        (event) => {
            navigate(`/time-entries/${event.id}`);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <Card shadow="sm" p="md">
            <FullCalendar
                themeSystem="standard"
                nowIndicator={true}
                allDaySlot={false}
                locale="de"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={loaderData.timeEntries.map((timeEntry) => {
                    return {
                        id: timeEntry.id,
                        title: timeEntry.text,
                        start: timeEntry.start,
                        end: timeEntry.end,
                    };
                })}
                eventClick={handleEventClick}
                plugins={[ interactionPlugin, dayGridPlugin, timeGridPlugin ]}
                initialView="timeGridWeek"
            />
        </Card>
    );
}
