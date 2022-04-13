import { useFetcher } from '@remix-run/react';
import { ActionIcon, Box, Button, Card, Group, MediaQuery, Stack } from '@mantine/core';
import dayjs from 'dayjs';
import { toDuration } from '~/utils/helpers';
import { IconTrash } from '@tabler/icons';
import { Activity, Client, Project, TimeTrack } from '@prisma/client'

interface TimeTrackRowProps {
    timeTrack: TimeTrack;
    activity: Activity;
    project: Project;
    client: Client;
}

export function TimeTrackRow(props: TimeTrackRowProps) {
    const fetcher = useFetcher();
    const { timeTrack, activity, project, client } = props;

    return (
        <fetcher.Form method="delete" action={`/time-tracks/${timeTrack.id}`}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Card shadow="sm" p="md" mt="md">
                    <Stack align="stretch">
                        <Box>
                            {client.name}: {project.name} - {activity.name}
                        </Box>
                        <Box>
                            {dayjs(timeTrack.start).format('HH:mm:ss')} bis {dayjs(timeTrack.end).format('HH:mm:ss')}
                        </Box>
                        <Box>
                            <strong>
                                {timeTrack.end && toDuration(timeTrack.start, timeTrack.end)}
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
                            {client.name}: {project.name} - {activity.name}
                        </Box>
                        <Box sx={{ width: '155px' }}>
                            {dayjs(timeTrack.start).format('HH:mm:ss')} bis {dayjs(timeTrack.end).format('HH:mm:ss')}
                        </Box>
                        <Box>
                            <strong>
                                {timeTrack.end && toDuration(timeTrack.start, timeTrack.end)}
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
