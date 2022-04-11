import type { DataFunctionArgs } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { ActionIcon, Stack, Title } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useLayoutEffect, useState } from 'react';

dayjs.extend(duration);

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
    const timeTrack = await db.timeTrack.findFirst({
        where: {
            end: null,
        },
    });

    return { timeTrack };
}

export default function Index() {
    const actionData = useActionData<InferDataFunction<typeof action>>();
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();
    const [ timer, setTimer ] = useState<string | null>(null);


    useLayoutEffect(() => {
        setInterval(() => {
            if (loaderData.timeTrack) {
                setTimer(
                    dayjs.duration(dayjs().diff(loaderData.timeTrack.start)).format('HH:mm:ss')
                );
            } else {
                setTimer(null);
            }
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <Stack align="center">

                {
                    loaderData.timeTrack ? (
                        <Title>{dayjs.duration(dayjs().diff(loaderData.timeTrack.start)).format('HH:mm:ss')}</Title>
                    ) : null
                }
                <Form method="post">
                    {
                        loaderData.timeTrack ? (
                            <>


                                <ActionIcon
                                    type="submit"
                                    name="action"
                                    value="stopTimer"
                                    variant="light"
                                    size="xl"
                                    radius="xl"
                                    color="indigo">
                                    <IconPlayerStop />
                                </ActionIcon>
                            </>


                        ) : (
                            <ActionIcon
                                type="submit"
                                name="action"
                                value="startTimer"
                                variant="light"
                                size="xl"
                                radius="xl"
                                color="indigo">
                                <IconPlayerPlay />
                            </ActionIcon>
                        )
                    }

                </Form>


                <pre>{JSON.stringify(actionData, null, 2)}</pre>
                <pre>{JSON.stringify(loaderData, null, 2)}</pre>
            </Stack>
        </>
    );
}
