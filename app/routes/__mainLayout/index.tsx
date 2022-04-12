import type { DataFunctionArgs } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { ActionIcon, Box, Stack, Table, Title } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons';


import { useEffect, useState } from 'react';
import { useInterval } from '@mantine/hooks';
import dayjs from 'dayjs';


export async function action({ request, params }: DataFunctionArgs) {
    const formData = await request.formData();
    const action = formData.get('action');


    switch (action) {
        case 'startTimer':
            return db.timeTrack.create({
                data: {
                    start: new Date(),
                    end: null
                }
            });

        case 'stopTimer':
            return db.timeTrack.updateMany({
                data: {
                    end: new Date(),
                },
                where: {
                    end: null,
                },
            });
    }


    return formData;
}

export async function loader({ request }: DataFunctionArgs) {
    const timeTracks = await db.timeTrack.findMany();

    const timeTrack = await db.timeTrack.findFirst({
        where: {
            end: null,
        },
    });


    return { timeTracks, timeTrack };
}

export default function Index() {
    const actionData = useActionData<InferDataFunction<typeof action>>();
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();
    const [ timer, setTimer ] = useState<string | null>(null);
    const interval = useInterval(() => {
        if (loaderData.timeTrack) {
            setTimer(calculateDuration(loaderData.timeTrack.start, new Date()));
        }
    }, 1000);

    useEffect(() => {
        console.log('useEffect');
        if (loaderData.timeTrack) {
            console.log('interval.start()');
            if (loaderData.timeTrack) {
                setTimer(calculateDuration(loaderData.timeTrack.start, new Date()));
            }
            interval.start();
        } else {
            console.log('interval.stop()');
            setTimer('');
            interval.stop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ loaderData.timeTrack ]);


    function calculateDuration(startDate: Date, endDate:  Date) {
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        const diff = end.diff(start);
        const duration = dayjs.duration(diff);
        return duration.format('HH:mm:ss');
    }


    return (
        <>
            <Stack align="center">

                <Box sx={{ height: '48px' }}>
                    {
                        loaderData.timeTrack ? (
                            <Title>{timer}</Title>
                        ) : null
                    }
                </Box>


                <Form method="post">
                    {
                        loaderData.timeTrack ? (
                            <>


                                <ActionIcon
                                    type="submit"
                                    name="action"
                                    value="stopTimer"
                                    variant="filled"
                                    size={128}
                                    radius={128}
                                    color="indigo">
                                    <IconPlayerStop size={100} />
                                </ActionIcon>
                            </>


                        ) : (
                            <ActionIcon
                                type="submit"
                                name="action"
                                value="startTimer"
                                variant="filled"
                                size={128}
                                radius={128}
                                color="indigo">
                                <IconPlayerPlay size={100} />
                            </ActionIcon>
                        )
                    }

                </Form>


                <Table>
                    <thead>
                    <tr>
                        <th>Start</th>
                        <th>End</th>
                        <th>Duration</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        loaderData.timeTracks.map(({ id, start, end }) => (
                            <tr key={id}>
                                <td>{dayjs(start).format('HH:mm:ss')}</td>
                                <td>{end ? dayjs(end).format('HH:mm:ss') : '-'}</td>
                                <td>{end ?  calculateDuration(start, end) : 'Running...'}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
            </Stack>
        </>
    );
}
