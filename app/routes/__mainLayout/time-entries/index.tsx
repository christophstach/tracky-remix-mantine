import type { DataFunctionArgs } from '@remix-run/node';
import { badRequest, forbidden, redirectBack } from 'remix-utils';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { TimeEntryRow } from '~/components/TimeEntryRow';
import { setNotification } from '~/services/notification-session.server';
import { validateUpdateTimeEntryText } from '~/validators/time-entries/update-time-entry-text';
import { Accordion, Box, Card, Divider, Group, Text } from '@mantine/core';
import dayjs from 'dayjs';
import CumulatedTimer from '~/components/CumulatedTimer';
import type { Client, Project, Task, TimeEntry } from '@prisma/client';
import { json, useLoaderData } from 'superjson-remix';

export const handle = {
    breadcrumbs: () => {
        return [
            { to: '/time-entries', label: 'Zeiterfassungen' }
        ];
    }
}

export async function action({ request }: DataFunctionArgs) {
    const userId = await authenticator.isAuthenticated(request);
    const { success, data, fieldErrors } = await validateUpdateTimeEntryText(await request.formData());
    const id = data?.id;

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!userId) {
        throw forbidden('Not allowed');
    }

    if (success && data) {
        await db.timeEntry.update({
            data: {
                text: data.text,
            },
            where: { id },
        })

        return redirectBack(request, {
            fallback: '/',
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

export async function loader({ request }: DataFunctionArgs) {
    const userId = await authenticator.isAuthenticated(request);

    if (!userId) {
        throw forbidden('Not allowed');
    }


    const timeEntries = await db.timeEntry.findMany({
        orderBy: {
            start: 'desc'
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
            userId
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
            userId
        },
        include: {
            project: {
                include: {
                    client: true
                }
            }
        }
    });

    const today = await db.timeEntry.findMany({
        orderBy: {
            start: 'desc'
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
            userId,
            start: {
                gte: dayjs(new Date())
                    .startOf('day')
                    .toDate(),
                lt: dayjs(new Date())
                    .endOf('day')
                    .toDate()
            }
        }
    });

    const yesterday = await db.timeEntry.findMany({
        orderBy: {
            start: 'desc'
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
            userId,
            start: {
                gte: dayjs(new Date())
                    .startOf('day')
                    .subtract(1, 'days')
                    .toDate(),
                lt: dayjs(new Date())
                    .endOf('day')
                    .subtract(1, 'days')
                    .toDate()
            }
        }
    });

    const currentWeek = await db.timeEntry.findMany({
        orderBy: {
            start: 'desc'
        },
        where: {
            userId,
            start: {
                gte: dayjs(new Date())
                    .startOf('week')
                    .toDate(),
                lt: dayjs(new Date())
                    .endOf('week')
                    .toDate()
            }
        }
    });

    const lastWeek = await db.timeEntry.findMany({
        orderBy: {
            start: 'desc'
        },
        where: {
            userId,
            start: {
                gte: dayjs(new Date())
                    .startOf('week')
                    .subtract(1, 'weeks')
                    .toDate(),
                lt: dayjs(new Date())
                    .endOf('week')
                    .subtract(1, 'weeks')
                    .toDate()
            }
        }
    });

    const currentMonth = await db.timeEntry.findMany({
        orderBy: {
            start: 'desc'
        },
        where: {
            userId,
            start: {
                gte: dayjs(new Date())
                    .startOf('month')
                    .toDate(),
                lt: dayjs(new Date())
                    .endOf('month')
                    .toDate()
            }
        }
    });

    const lastMonth = await db.timeEntry.findMany({
        orderBy: {
            start: 'desc'
        },
        where: {
            userId,
            start: {
                gte: dayjs(new Date())
                    .startOf('month')
                    .subtract(1, 'month')
                    .toDate(),
                lt: dayjs(new Date())
                    .endOf('month')
                    .subtract(1, 'month')
                    .toDate()
            }
        }
    });

    const weekdays = [
        'Sonntag',
        'Montag',
        'Dienstag',
        'Mittwoch',
        'Donnerstag',
        'Freitag',
        'Samstag',
    ]

    const days = [
        {
            label: 'Heute',
            timeEntries: today
        },
        {
            label: 'Gestern',
            timeEntries: yesterday
        },
        {
            label: weekdays[dayjs(new Date()).subtract(2, 'days').weekday()],
            timeEntries: await db.timeEntry.findMany({
                orderBy: {
                    start: 'desc'
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
                    userId,
                    start: {
                        gte: dayjs(new Date())
                            .startOf('day')
                            .subtract(2, 'days')
                            .toDate(),
                        lt: dayjs(new Date())
                            .endOf('day')
                            .subtract(2, 'days')
                            .toDate()
                    }
                }
            })
        },
        {
            label: weekdays[dayjs(new Date()).subtract(3, 'days').weekday()],
            timeEntries: await db.timeEntry.findMany({
                orderBy: {
                    start: 'desc'
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
                    userId,
                    start: {
                        gte: dayjs(new Date())
                            .startOf('day')
                            .subtract(3, 'days')
                            .toDate(),
                        lt: dayjs(new Date())
                            .endOf('day')
                            .subtract(3, 'days')
                            .toDate()
                    }
                }
            })
        },
        {
            label: weekdays[dayjs(new Date()).subtract(4, 'days').weekday()],
            timeEntries: await db.timeEntry.findMany({
                orderBy: {
                    start: 'desc'
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
                    userId,
                    start: {
                        gte: dayjs(new Date())
                            .startOf('day')
                            .subtract(4, 'days')
                            .toDate(),
                        lt: dayjs(new Date())
                            .endOf('day')
                            .subtract(4, 'days')
                            .toDate()
                    }
                }
            })
        },
        {
            label: weekdays[dayjs(new Date()).subtract(5, 'days').weekday()],
            timeEntries: await db.timeEntry.findMany({
                orderBy: {
                    start: 'desc'
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
                    userId,
                    start: {
                        gte: dayjs(new Date())
                            .startOf('day')
                            .subtract(5, 'days')
                            .toDate(),
                        lt: dayjs(new Date())
                            .endOf('day')
                            .subtract(5, 'days')
                            .toDate()
                    }
                }
            })
        },
        {
            label: weekdays[dayjs(new Date()).subtract(6, 'days').weekday()],
            timeEntries: await db.timeEntry.findMany({
                orderBy: {
                    start: 'desc'
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
                    userId,
                    start: {
                        gte: dayjs(new Date())
                            .startOf('day')
                            .subtract(6, 'days')
                            .toDate(),
                        lt: dayjs(new Date())
                            .endOf('day')
                            .subtract(6, 'days')
                            .toDate()
                    }
                }
            })
        }
    ];


    return json<LoaderReturnType>({
        today,
        yesterday,
        currentWeek,
        lastWeek,
        currentMonth,
        lastMonth,
        timeEntries,
        tasks,
        days: days.filter((day) => day.timeEntries.length > 0)
    });
}

interface LoaderReturnType {
    today: TimeEntry[];
    yesterday: TimeEntry[];
    currentWeek: TimeEntry[];
    lastWeek: TimeEntry[];
    currentMonth: TimeEntry[];
    lastMonth: TimeEntry[];
    timeEntries: (TimeEntry & {
        task: (Task & {
            project: (Project & {
                client: Client | null | undefined
            }) | null | undefined
        }) | null | undefined;
    })[];
    tasks: (Task & {
        project: (Project & {
            client: Client | null | undefined
        }) | null | undefined
    })[];
    days: {
        label: string;
        timeEntries: (TimeEntry & {
            task: (Task & {
                project: (Project & {
                    client: Client | null | undefined
                }) | null | undefined
            }) | null | undefined;
        })[];
    }[];
}

export default function TimerIndex() {
    const loaderData = useLoaderData<LoaderReturnType>();

    return (
        <>
            <Card shadow="sm" p="md">
                <Group position="apart" spacing="xs">
                    <Box>
                        <small>
                            Heute • <CumulatedTimer durations={loaderData.today} />
                        </small>
                    </Box>
                    <Box>
                        <small>
                            Gestern • <CumulatedTimer durations={loaderData.yesterday} />
                        </small>
                    </Box>
                    <Box>
                        <small>
                            Diese Woche • <CumulatedTimer durations={loaderData.currentWeek} />
                        </small>
                    </Box>
                    <Box>
                        <small>
                            Letzte Woche • <CumulatedTimer durations={loaderData.lastWeek} />
                        </small>
                    </Box>
                    <Box>
                        <small>
                            Dieser Monat • <CumulatedTimer durations={loaderData.currentMonth} />
                        </small>
                    </Box>
                    <Box>
                        <small>
                            Letzter Monat • <CumulatedTimer durations={loaderData.lastMonth} />
                        </small>
                    </Box>
                </Group>
            </Card>
            {loaderData.days.map((day, dayIndex) => {
                return (
                    <Card key={dayIndex} shadow="sm" p="md" mt="xs">
                        <Group>
                            <Box sx={{ flex: 1 }}>
                                <strong>{day.label}</strong>
                            </Box>
                            <Box>

                                <Text color="dimmed">
                                    <small>
                                        <CumulatedTimer durations={day.timeEntries} />
                                    </small>
                                </Text>
                            </Box>
                        </Group>

                        <Card.Section mt="sm">
                            <Divider />
                            <Accordion
                                multiple
                                initialItem={dayIndex === 0 ? 0 : -1}
                                pb={0}
                                styles={{
                                    contentInner: {
                                        paddingBottom: '5px'
                                    },
                                    item: {
                                        paddingBottom: '0px !important'
                                    }
                                }}
                            >
                                {day.timeEntries.map((timeEntry, timeEntryIndex) => {
                                    return (
                                        <Accordion.Item
                                            opened
                                            key={timeEntry.id}
                                            label={timeEntry.text || <em>Keine Beschreibung</em>}
                                            pb={5}
                                        >
                                            <TimeEntryRow
                                                key={timeEntry.id}
                                                timeEntry={timeEntry}
                                                task={timeEntry.task}
                                                project={timeEntry.task?.project}
                                                client={timeEntry.task?.project?.client}
                                                focus={dayIndex === 0 && timeEntryIndex === 0}
                                            />
                                        </Accordion.Item>
                                    );
                                })}
                            </Accordion>
                        </Card.Section>
                    </Card>
                );
            })}
        </>
    );
}
