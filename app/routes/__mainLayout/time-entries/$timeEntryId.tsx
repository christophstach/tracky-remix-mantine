import { db } from '~/services/db.server';
import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { badRequest, forbidden, notFound, redirectBack } from 'remix-utils';
import { authenticator } from '~/services/auth.server';
import { setNotification } from '~/services/notification-session.server';
import { Card, Group, Select, Stack, TextInput } from '@mantine/core';
import { Form, useActionData, useFetcher, useLoaderData, useParams, useTransition } from '@remix-run/react';
import BottomActions from '~/components/BottomActions';
import { validateUpdateTimeEntry } from '~/validators/time-entries/update-time-entry';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useState } from 'react';
import dayjs from 'dayjs';
import type { Task } from '@prisma/client';


export async function action({ request, params }: DataFunctionArgs) {
    const id = params.timeEntryId;
    const userId = await authenticator.isAuthenticated(request);

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!userId) {
        throw forbidden('Not allowed');
    }

    if (id !== 'new') {
        const count = await db.timeEntry.count({
            where: {
                id,
                userId
            }
        });

        if (count === 0) {
            throw notFound('Not found');
        }
    }

    if (request.method === 'DELETE') {
        await db.timeEntry.delete({
            where: {
                id
            }
        });

        return redirect('/time-entries', {
            headers: {
                'Set-Cookie': await setNotification(
                    request.headers.get('Cookie'),
                    'success',
                    'Zeiteintrag gelöscht',
                    'Der Zeiteintrag wurde erfolgreich gelöscht'
                )
            }
        });
    }

    const formData = await request.formData();
    const { success, data, fieldErrors } = await validateUpdateTimeEntry(formData);

    if (success && data) {
        await db.timeEntry.update({
            where: {
                id
            },
            data: {
                text: data.text,
                start: data.start,
                end: data.end,
                taskId: data.taskId
            }
        });

        return redirectBack(request, {
            fallback: '/time-entries',
            headers: {
                'Set-Cookie': await setNotification(
                    request.headers.get('Cookie'),
                    'success',
                    'Zeiteintrag geändert',
                    'Der Zeiteintrag wurde erfolgreich geändert'
                )
            }
        });
    } else {
        return { fieldErrors };
    }
}

export async function loader({ params, request }: DataFunctionArgs) {
    const id = params.timeEntryId;
    const userId = await authenticator.isAuthenticated(request);

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!userId) {
        throw forbidden('Not allowed');
    }

    if (await db.timeEntry.count({ where: { id, userId } }) === 0) {
        throw notFound('Not found');
    }

    const timeEntry = await db.timeEntry.findUnique({
        where: {
            id,
        }
    });

    const tasks = await db.task.findMany({
        orderBy: {
            name: 'asc'
        },
        where: {
            userId
        }
    });

    return { timeEntry, tasks };
}

interface LoaderReturnType {
    timeEntry: {
        id: string;
        text: string;
        start: string;
        end: string | null | undefined;
        taskId: string | null | undefined;
    };
    tasks: Task[];
}


export default function () {
    const params = useParams();
    const fetcher = useFetcher();
    const transition = useTransition();
    const actionData = useActionData<InferDataFunction<typeof action>>();
    const loaderData = useLoaderData<LoaderReturnType>();
    const id = params.timeEntryId;

    const [ start, setStart ] = useState<Date | null>(new Date(loaderData.timeEntry.start));
    const [ end, setEnd ] = useState(loaderData.timeEntry.end ? new Date(loaderData.timeEntry.end) : null);

    function handleDelete() {
        fetcher.submit(null, { method: 'delete' });
    }

    function handleChangeStartDate(value: Date | null) {
        const current = dayjs(start);
        const date = dayjs(value)
            .set('hour', current.get('hour'))
            .set('minute', current.get('minute'))
            .set('second', current.get('second'))
            .set('millisecond', current.get('millisecond'));

        setStart(date.toDate())
    }

    function handleChangeEndDate(value: Date | null) {
        const current = dayjs(end);
        const date = dayjs(value)
            .set('hour', current.get('hour'))
            .set('minute', current.get('minute'))
            .set('second', current.get('second'))
            .set('millisecond', current.get('millisecond'));

        setEnd(date.toDate())
    }


    return (
        <Form method="post">
            <Card shadow="md" p="md">
                <Stack spacing="md">
                    <TextInput
                        autoFocus
                        label="Name"
                        autoComplete="off"
                        name="text"
                        error={actionData?.fieldErrors?.name}
                        defaultValue={loaderData.timeEntry?.text}
                    />

                    <Group grow align="start">
                        <DatePicker
                            clearable={false}
                            label="Startdatum"
                            value={start}
                            onChange={handleChangeStartDate}
                            error={actionData?.fieldErrors.start}
                        />

                        <TimeInput
                            withSeconds
                            label="Startzeit"
                            onChange={setStart}
                            value={start}
                            error={!!actionData?.fieldErrors.start}
                        />
                    </Group>


                    <Group grow align="start">
                        <DatePicker
                            clearable={false}
                            label="Enddatum"
                            value={end}
                            onChange={handleChangeEndDate}
                            error={actionData?.fieldErrors.end}
                        />

                        <TimeInput
                            withSeconds
                            label="Endzeit"
                            onChange={setEnd}
                            defaultValue={end}
                            error={!!actionData?.fieldErrors.end}
                        />
                    </Group>

                    <Select
                        searchable
                        clearable
                        name="taskId"
                        label="Tätigkeit"
                        defaultValue={loaderData.timeEntry.taskId}
                        data={loaderData.tasks.map((task) => ({
                            label: task.name,
                            value: task.id
                        }))}
                        error={actionData?.fieldErrors.taskId}
                    />
                </Stack>

                <input type="hidden" name="start" value={start?.toISOString()} />
                <input type="hidden" name="end" value={end?.toISOString()} />
            </Card>

            <BottomActions
                backLink="/time-entries"
                showDelete={id !== 'new'}
                loading={
                    transition.state === 'loading' ||
                    transition.state === 'submitting' ||
                    fetcher.state === 'loading' ||
                    fetcher.state === 'submitting'
                }
                onDelete={handleDelete}
            />
        </Form>
    );
}

