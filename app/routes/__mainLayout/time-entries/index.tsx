import type { DataFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { badRequest, forbidden, redirectBack } from 'remix-utils';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { TimeEntryRow } from '~/components/TimeEntryRow';
import { setNotification } from '~/services/notification-session.server';
import { validateUpdateTimeEntryText } from '~/validators/time-entries/update-time-entry-text';
import { Accordion, Box, Card, Divider, Group, Text } from '@mantine/core';
import dayjs from 'dayjs';
import CumulatedTimer from '~/components/CumulatedTimer';
import { IconLayoutDistributeVertical } from '@tabler/icons';

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
                            .set('hours', 0)
                            .set('minutes', 0)
                            .set('seconds', 0)
                            .set('milliseconds', 0)
                            .toDate(),
                        lt: dayjs(new Date())
                            .set('hours', 23)
                            .set('minutes', 59)
                            .set('seconds', 59)
                            .set('milliseconds', 999)
                            .toDate()
                    }
                }
            })
        },
        {
            label: 'Gestern',
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
                            .subtract(1, 'days')
                            .set('hours', 0)
                            .set('minutes', 0)
                            .set('seconds', 0)
                            .set('milliseconds', 0)
                            .toDate(),
                        lt: dayjs(new Date())
                            .subtract(1, 'days')
                            .set('hours', 23)
                            .set('minutes', 59)
                            .set('seconds', 59)
                            .set('milliseconds', 999)
                            .toDate()
                    }
                }
            })
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
                            .subtract(2, 'days')
                            .set('hours', 0)
                            .set('minutes', 0)
                            .set('seconds', 0)
                            .set('milliseconds', 0)
                            .toDate(),
                        lt: dayjs(new Date())
                            .subtract(2, 'days')
                            .set('hours', 23)
                            .set('minutes', 59)
                            .set('seconds', 59)
                            .set('milliseconds', 999)
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
                            .subtract(3, 'days')
                            .set('hours', 0)
                            .set('minutes', 0)
                            .set('seconds', 0)
                            .set('milliseconds', 0)
                            .toDate(),
                        lt: dayjs(new Date())
                            .subtract(3, 'days')
                            .set('hours', 23)
                            .set('minutes', 59)
                            .set('seconds', 59)
                            .set('milliseconds', 999)
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
                            .subtract(4, 'days')
                            .set('hours', 0)
                            .set('minutes', 0)
                            .set('seconds', 0)
                            .set('milliseconds', 0)
                            .toDate(),
                        lt: dayjs(new Date())
                            .subtract(4, 'days')
                            .set('hours', 23)
                            .set('minutes', 59)
                            .set('seconds', 59)
                            .set('milliseconds', 999)
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
                            .subtract(5, 'days')
                            .set('hours', 0)
                            .set('minutes', 0)
                            .set('seconds', 0)
                            .set('milliseconds', 0)
                            .toDate(),
                        lt: dayjs(new Date())
                            .subtract(5, 'days')
                            .set('hours', 23)
                            .set('minutes', 59)
                            .set('seconds', 59)
                            .set('milliseconds', 999)
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
                            .subtract(6, 'days')
                            .set('hours', 0)
                            .set('minutes', 0)
                            .set('seconds', 0)
                            .set('milliseconds', 0)
                            .toDate(),
                        lt: dayjs(new Date())
                            .subtract(6, 'days')
                            .set('hours', 23)
                            .set('minutes', 59)
                            .set('seconds', 59)
                            .set('milliseconds', 999)
                            .toDate()
                    }
                }
            })
        }
    ];

    return {
        timeEntries,
        tasks,
        days: days.filter((day) => day.timeEntries.length > 0)
    };
}

export default function TimerIndex() {
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();

    return (
        <>
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
                                        <Accordion.Item opened key={timeEntry.id} label={timeEntry.text} pb={5}>
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
