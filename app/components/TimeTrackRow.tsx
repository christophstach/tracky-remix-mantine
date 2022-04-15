import { useFetcher } from '@remix-run/react';
import { ActionIcon, Box, Button, Card, Group, MediaQuery, Stack } from '@mantine/core';
import dayjs from 'dayjs';
import { toDuration } from '~/utils/helpers';
import { IconTrash } from '@tabler/icons';
import { Task, Client, Project, TimeEntry } from '@prisma/client'

interface TimeTrackRowProps {
    timeEntry: TimeEntry;
    task: Task | null | undefined;
    project: Project | null | undefined;
    client: Client | null | undefined;
}

export function TimeTrackRow(props: TimeTrackRowProps) {
    const fetcher = useFetcher();
    const { timeEntry, task, project, client } = props;

    return (
        <fetcher.Form method="delete" action={`/time-entries/${timeEntry.id}`}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Card shadow="sm" p="md" mt="md">
                    <Stack align="stretch">
                        <Box>
                            {client && `${client.name}: `}
                            {project && `${project.name} - `}
                            {task && task.name}
                        </Box>
                        <Box>
                            {dayjs(timeEntry.start).format('HH:mm:ss')} bis {dayjs(timeEntry.end).format('HH:mm:ss')}
                        </Box>
                        <Box>
                            <strong>
                                {timeEntry.end && toDuration(timeEntry.start, timeEntry.end)}
                            </strong>
                        </Box>
                        <Box>
                            <Button
                                sx={{ width: '100%' }}
                                type="submit"
                                leftIcon={<IconTrash />}
                                variant="light"
                                color="red"
                                loading={
                                    fetcher.state === 'submitting' ||
                                    fetcher.state === 'loading'
                                }
                            >
                                Löschen
                            </Button>
                        </Box>
                    </Stack>
                </Card>
            </MediaQuery>

            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Card shadow="sm" p="md" mt="md">
                    <Group>
                        <Box sx={{ flex: 1 }}>
                            {client && `${client.name}: `}
                            {project && `${project.name} - `}
                            {task && task.name}
                        </Box>
                        <Box sx={{ width: '155px' }}>
                            {dayjs(timeEntry.start).format('HH:mm:ss')} bis {dayjs(timeEntry.end).format('HH:mm:ss')}
                        </Box>
                        <Box>
                            <strong>
                                {timeEntry.end && toDuration(timeEntry.start, timeEntry.end)}
                            </strong>
                        </Box>
                        <Box>
                            <ActionIcon
                                type="submit"
                                variant="light"
                                color="red"
                                size="lg"
                                radius="lg"
                                loading={
                                    fetcher.state === 'submitting' ||
                                    fetcher.state === 'loading'
                                }
                            >
                                <IconTrash />
                            </ActionIcon>
                        </Box>
                    </Group>
                </Card>
            </MediaQuery>
        </fetcher.Form>
    );
}
