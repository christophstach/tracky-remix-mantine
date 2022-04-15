import { useFetcher } from '@remix-run/react';
import { ActionIcon, Box, Card, TextInput } from '@mantine/core';
import dayjs from 'dayjs';
import { toDuration } from '~/utils/helpers';
import { IconTrash } from '@tabler/icons';
import type { Client, Project, Task, TimeEntry } from '@prisma/client'
import Timer from '~/components/Timer';

interface TimeEntryRowProps {
    timeEntry: TimeEntry;
    task: Task | null | undefined;
    project: Project | null | undefined;
    client: Client | null | undefined;
}

export function TimEntryRow(props: TimeEntryRowProps) {
    const deleteFetcher = useFetcher();
    const updateFetcher = useFetcher();
    const { timeEntry, task, project, client } = props;

    return (
        <Card shadow="sm" p="xs" mt="xs">
            <Box sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.md
            })}>
                <Box sx={{ flex: 1 }}>
                    <updateFetcher.Form method="post">
                        <input type="hidden" name="id" value={timeEntry.id} />
                        <TextInput name="text" size="xs" defaultValue={timeEntry.text} />
                    </updateFetcher.Form>
                </Box>
                <Box>
                    {client && `${client.name}: `}
                    {project && `${project.name} - `}
                    {task && task.name}
                </Box>
                <Box sx={{ width: '154px' }}>
                    {timeEntry.end ? (
                        `${dayjs(timeEntry.start).format('HH:mm:ss')} bis ${dayjs(timeEntry.end).format('HH:mm:ss')}`
                    ) : (
                        `${dayjs(timeEntry.start).format('HH:mm:ss')} bis jetzt`
                    )}
                </Box>
                <Box sx={{ width: '65px' }}>
                    <strong>
                        {timeEntry.end ? (
                            toDuration(timeEntry.start, timeEntry.end)
                        ) : (
                            <Timer start={timeEntry.start} end={new Date()} />
                        )}
                    </strong>
                </Box>
                <Box>
                    <deleteFetcher.Form method="delete" action={`/time-entries/${timeEntry.id}`}>
                        <ActionIcon
                            type="submit"
                            variant="light"
                            color="red"
                            loading={
                                deleteFetcher.state === 'submitting' ||
                                deleteFetcher.state === 'loading'
                            }
                        >
                            <IconTrash />
                        </ActionIcon>
                    </deleteFetcher.Form>
                </Box>
            </Box>
        </Card>
    );
}