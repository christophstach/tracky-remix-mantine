import { DataFunctionArgs } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { forbidden, notFound, redirectBack } from 'remix-utils';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { ActionIcon, Box, Button, Card, Group, MediaQuery, Select, Stack, Text } from '@mantine/core';
import { forwardRef, useEffect, useState } from 'react';
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons';
import { toDuration } from '~/utils/helpers';
import { useInterval } from '@mantine/hooks';
import dayjs from 'dayjs';
import { TimeTrackRow } from '~/components/TimeTrackRow';
import { validateTimer } from '~/validators/time-entries/timer';


export async function action({ request }: DataFunctionArgs) {
    const user = await authenticator.isAuthenticated(request);
    const { success, data, fieldErrors } = await validateTimer(await request.formData());

    if (!user) {
        throw forbidden('Not allowed');
    }

    const count = await db.task.count({
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
            await db.timeEntry.create({
                data: {
                    start: new Date(),
                    end: null,
                    taskId: data.taskId,
                }
            });

            return redirectBack(request, { fallback: '/timer' });
        } else if (data.operation === 'stop') {
            await db.timeEntry.updateMany({
                data: {
                    end: new Date(),
                },
                where: {
                    end: null,
                    task: {
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

        return redirectBack(request, { fallback: '/timer' });
    } else {
        console.log('failure', fieldErrors);

        return { fieldErrors };
    }
}

export async function loader({ request }: DataFunctionArgs) {
    const user = await authenticator.isAuthenticated(request);

    if (!user) {
        throw forbidden('Not allowed');
    }

    const currentTimeEntry = await db.timeEntry.findFirst({
        where: {
            end: null,
            task: {
                project: {
                    client: {
                        userId: user.id
                    }
                }
            }
        }
    });

    const timeEntries = await db.timeEntry.findMany({
        orderBy: {
            end: 'desc'
        },
        include: {
            task: {
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
            task: {
                project: {
                    client: {
                        userId: user.id
                    }
                }
            }
        }
    });

    const tasks = await db.task.findMany({
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

    return { currentTimeTrack: currentTimeEntry, timeEntries: timeEntries, tasks };
}

export default function TimerIndex() {
    const fetcher = useFetcher();
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

            <fetcher.Form method="post">
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Card shadow="sm" p="md">
                        <Stack align="stretch">
                            <Box>
                                <Select
                                    searchable
                                    size="md"
                                    name="activityId"
                                    error={fetcher.data?.fieldErrors?.activityId}
                                    data={loaderData.tasks.map(task => {
                                        return {
                                            label: `
                                                ${task.project?.client && `${task.project.client.name}: `}
                                                ${task.project && `${task.project.name} - `}
                                                ${task && task.name}
                                            `,
                                            value: task.id,
                                            ...task
                                        };
                                    })}
                                    filter={(value, item) =>
                                        item.name.toLowerCase().includes(value.toLowerCase().trim()) ||
                                        item.project.name.toLowerCase().includes(value.toLowerCase().trim()) ||
                                        item.project.client.name.toLowerCase().includes(value.toLowerCase().trim())
                                    }
                                    itemComponent={forwardRef<HTMLDivElement, UnArray<typeof loaderData.tasks>>((
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
                                                >
                                                    {project?.client && project ? `${project.client.name}: ` : project?.client?.name}
                                                    {project?.name}
                                                </Text>
                                            </Box>
                                        </div>
                                    ))}
                                />
                            </Box>
                            {loaderData.currentTimeTrack ? (
                                <Box>
                                    {dayjs(loaderData.currentTimeTrack.start).format('HH:mm:ss')} bis jetzt
                                </Box>
                            ) : (
                                <Box></Box>
                            )}
                            <Box>
                                <strong>
                                    {timer}
                                </strong>
                            </Box>
                            <Box>
                                {loaderData.currentTimeTrack ? (
                                    <Button
                                        sx={{ width: '100%' }}
                                        type="submit"
                                        name="operation"
                                        value="stop"
                                        variant="light"
                                        color="indigo"
                                        leftIcon={<IconPlayerStop />}
                                        loading={
                                            fetcher.state === 'submitting' ||
                                            fetcher.state === 'loading'
                                        }
                                    >
                                        Stop
                                    </Button>
                                ) : (
                                    <Button
                                        sx={{ width: '100%' }}
                                        type="submit"
                                        name="operation"
                                        value="start"
                                        variant="light"
                                        color="indigo"
                                        leftIcon={<IconPlayerPlay />}
                                        loading={
                                            fetcher.state === 'submitting' ||
                                            fetcher.state === 'loading'
                                        }
                                    >
                                        Start
                                    </Button>
                                )}
                            </Box>
                        </Stack>
                    </Card>
                </MediaQuery>

                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                    <Card shadow="sm" p="md">
                        <Group>
                            <Box sx={{ flex: 1 }}>
                                <Select
                                    searchable
                                    size="md"
                                    name="activityId"
                                    error={fetcher.data?.fieldErrors?.taskId}
                                    data={loaderData.tasks.map(task => {
                                        return {
                                            label: `
                                                    ${task.project?.client && `${task.project.client.name}: `}
                                                    ${task.project && `${task.project.name} - `}
                                                    ${task && task.name}
                                                `,
                                            value: task.id,
                                            ...task
                                        };
                                    })}
                                    filter={(value, item) =>
                                        item.name.toLowerCase().includes(value.toLowerCase().trim()) ||
                                        item.project.name.toLowerCase().includes(value.toLowerCase().trim()) ||
                                        item.project.client.name.toLowerCase().includes(value.toLowerCase().trim())
                                    }
                                    itemComponent={forwardRef<HTMLDivElement, UnArray<typeof loaderData.tasks>>((
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
                                                >
                                                    {project?.client && project ? `${project.client.name}: ` : project?.client?.name}
                                                    {project?.name}
                                                </Text>
                                            </Box>
                                        </div>
                                    ))}
                                />
                            </Box>
                            {loaderData.currentTimeTrack ? (
                                <Box sx={{ width: '155px' }}>
                                    {dayjs(loaderData.currentTimeTrack.start).format('HH:mm:ss')} bis jetzt
                                </Box>
                            ) : (
                                <Box sx={{ width: '155px' }}></Box>
                            )}
                            <Box>
                                <strong>
                                    {timer}
                                </strong>
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
                                            fetcher.state === 'submitting' ||
                                            fetcher.state === 'loading'
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
                                            fetcher.state === 'submitting' ||
                                            fetcher.state === 'loading'
                                        }
                                    >
                                        <IconPlayerPlay />
                                    </ActionIcon>

                                )}
                            </Box>
                        </Group>
                    </Card>
                </MediaQuery>
            </fetcher.Form>


            {loaderData.timeEntries.map((timeEntry) => {
                return (
                    <TimeTrackRow
                        key={timeEntry.id}
                        timeEntry={timeEntry}
                        task={timeEntry.task}
                        project={timeEntry.task.project}
                        client={timeEntry.task?.project?.client}
                    />
                );
            })}
        </>
    );
}
