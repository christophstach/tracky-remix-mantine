import { DataFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react';
import { forbidden, notFound } from 'remix-utils';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { ActionIcon, Box, Card, Group, Select, Text } from '@mantine/core';
import { forwardRef, useEffect, useState } from 'react';
import { IconPlayerPlay, IconPlayerStop, IconTrash } from '@tabler/icons';
import { validateTimer } from '~/validators/time-tracks/timer';
import { toDuration } from '~/utils/helpers';
import { useInterval } from '@mantine/hooks';


export async function action({ request, params }: DataFunctionArgs) {
    const user = await authenticator.isAuthenticated(request);
    const { success, data, fieldErrors } = await validateTimer(await request.formData());

    if (!user) {
        throw forbidden('Not allowed');
    }

    const count = await db.activity.count({
        where: {
            project: {
                client: {
                    user: {
                        id: user.id
                    },
                }
            },
        }
    });

    if (count === 0) {
        throw notFound('Not found');
    }

    if (success && data) {
        console.log('success', data);

        if (data.operation === 'start') {
            await db.timeTrack.create({
                data: {
                    start: new Date(),
                    end: null,
                    activityId: data.activityId,
                }
            });
        } else if (data.operation === 'stop') {
            await db.timeTrack.updateMany({
                data: {
                    end: new Date(),
                },
                where: {
                    end: null,
                    activity: {
                        project: {
                            client: {
                                user: {
                                    id: user.id
                                },
                            }
                        }
                    }
                }
            });
        }
    } else {
        console.log('failure', fieldErrors);

        return { fieldErrors };
    }

    return {};
}

export async function loader({ request }: DataFunctionArgs) {
    const user = await authenticator.isAuthenticated(request);

    if (!user) {
        throw forbidden('Not allowed');
    }

    const currentTimeTrack = await db.timeTrack.findFirst({
        where: {
            end: null,
            activity: {
                project: {
                    client: {
                        userId: user.id
                    }
                }
            }
        }
    });

    const timeTracks = await db.timeTrack.findMany({
        include: {
            activity: {
                include: {
                    project: {
                        include: {
                            client: true
                        }
                    }
                }
            }
        },
        where: {
            end: {
                not: null
            },
            activity: {
                project: {
                    client: {
                        userId: user.id
                    }
                }
            }
        }
    });

    const activities = await db.activity.findMany({
        orderBy: [
            {
                name: 'asc',
            },
            {
                project: {
                    name: 'asc',
                }
            },
            {
                project: {
                    client: {
                        name: 'asc',
                    }
                }
            }
        ],
        where: {
            project: {
                client: {
                    userId: user.id
                }
            }
        },
        include: {
            project: {
                include: {
                    client: true
                }
            }
        }
    });

    return { currentTimeTrack, timeTracks, activities };
}

export default function TimerIndex() {
    const transition = useTransition();
    const actionData = useActionData<InferDataFunction<typeof action>>();
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();

    const [ timer, setTimer ] = useState<string | null>(null);

    const interval = useInterval(() => {
        if (loaderData.currentTimeTrack) {
            setTimer(toDuration(loaderData.currentTimeTrack.start, new Date()));
        }
    }, 1000);


    useEffect(() => {
        if (loaderData.currentTimeTrack) {
            setTimer(toDuration(loaderData.currentTimeTrack.start, new Date()));
            interval.start();
        } else {
            setTimer('00:00:00');
            interval.stop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ loaderData.currentTimeTrack ]);

    return (
        <>
            <Card shadow="sm" p="md">
                <Form method="post">
                    <Group>
                        <Box sx={{ flex: 1 }}>
                            <Select
                                searchable
                                size="md"
                                name="activityId"
                                error={actionData?.fieldErrors?.activityId}
                                defaultValue={loaderData.currentTimeTrack?.activityId}
                                data={loaderData.activities.map(activity => {
                                    return {
                                        label: `${activity.project.client.name}: ${activity.project.name} - ${activity.name}`,
                                        value: activity.id,
                                        ...activity
                                    };
                                })}
                                filter={(value, item) =>
                                    item.name.toLowerCase().includes(value.toLowerCase().trim()) ||
                                    item.project.name.toLowerCase().includes(value.toLowerCase().trim()) ||
                                    item.project.client.name.toLowerCase().includes(value.toLowerCase().trim())
                                }
                                itemComponent={forwardRef<HTMLDivElement, UnArray<typeof loaderData.activities>>((
                                    {
                                        name,
                                        project,
                                        ...others
                                    },
                                    ref
                                ) => (
                                    <div ref={ref} {...others}>
                                        <Box>
                                            <Text size="sm">{name}</Text>
                                            <Text
                                                size="xs"
                                                color="dimmed"
                                            >{project.name} für {project.client.name}</Text>
                                        </Box>
                                    </div>
                                ))}
                            />
                        </Box>
                        <Box>
                            {timer}
                        </Box>
                        <Box>
                            {loaderData.currentTimeTrack ? (
                                <ActionIcon
                                    type="submit"
                                    name="operation"
                                    value="stop"
                                    variant="light"
                                    color="indigo"
                                    size="lg"
                                    radius="lg"
                                    loading={
                                        transition.state === 'submitting' ||
                                        transition.state === 'loading'
                                    }
                                >
                                    <IconPlayerStop />
                                </ActionIcon>
                            ) : (
                                <ActionIcon
                                    type="submit"
                                    name="operation"
                                    value="start"
                                    variant="light"
                                    color="indigo"
                                    size="lg"
                                    radius="lg"
                                    loading={
                                        transition.state === 'submitting' ||
                                        transition.state === 'loading'
                                    }
                                >
                                    <IconPlayerPlay />
                                </ActionIcon>
                            )}

                        </Box>
                    </Group>
                </Form>
            </Card>

            {loaderData.timeTracks.map((timeTrack) => {
                return (
                    <Card key={timeTrack.id} shadow="sm" p="md" mt="md">
                        <Group>
                            <Box sx={{ flex: 1 }}>
                                {timeTrack.activity.project.client.name}: {timeTrack.activity.project.name} - {timeTrack.activity.name}
                            </Box>
                            <Box>
                                {timeTrack.end && toDuration(timeTrack.start, timeTrack.end)}
                            </Box>
                            <Box>
                                <ActionIcon
                                    variant="light"
                                    color="red"
                                    size="lg"
                                    radius="lg"
                                >
                                    <IconTrash />
                                </ActionIcon>
                            </Box>
                        </Group>
                    </Card>
                );
            })}
        </>
    );
}
