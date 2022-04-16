import { Link, useFetcher } from '@remix-run/react';
import { Box, Divider, Menu, Text, TextInput } from '@mantine/core';
import dayjs from 'dayjs';
import { toDuration } from '~/utils/helpers';
import { IconTrash } from '@tabler/icons';
import type { Client, Project, Task, TimeEntry } from '@prisma/client'
import Timer from '~/components/Timer';
import type { FormEvent } from 'react';

interface TimeEntryRowProps {
    timeEntry: TimeEntry;
    task: Task | null | undefined;
    project: Project | null | undefined;
    client: Client | null | undefined;
    focus: boolean;
}

export function TimeEntryRow(props: TimeEntryRowProps) {
    const deleteFetcher = useFetcher();
    const updateFetcher = useFetcher();
    const { timeEntry, task, project, client } = props;


    async function handleDeleteFormSubmit(event: FormEvent<HTMLFormElement>) {
        if (!confirm('Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?')) {
            event.preventDefault();
        }
    }

    return (
        <Box>
            <Box sx={(theme) => ({
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: theme.spacing.xs,
                [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                    gap: theme.spacing.md,
                },
            })}>
                <Box sx={(theme) => ({
                    flex: 1,
                    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
                        minWidth: '100%'
                    },
                })}>
                    <updateFetcher.Form method="post">
                        <input type="hidden" name="id" value={timeEntry.id} />
                        <TextInput
                            autoFocus={props.focus}
                            name="text"
                            placeholder="Beschreibung hinzufügen"
                            defaultValue={timeEntry.text}
                        />
                    </updateFetcher.Form>
                </Box>

                <Box sx={{ width: '76px' }}>
                    <Text color="dimmed">
                        <small>
                            {timeEntry.end ? (
                                `${dayjs(timeEntry.start).format('HH:mm')} - ${dayjs(timeEntry.end).format('HH:mm')}`
                            ) : (
                                `${dayjs(timeEntry.start).format('HH:mm')} - jetzt`
                            )}
                        </small>
                    </Text>
                </Box>
                <Box sx={{ width: '65px' }}>
                    <strong>
                        {timeEntry.end ? (
                            toDuration(timeEntry.start, timeEntry.end).format('HH:mm:ss')
                        ) : (
                            <Timer start={timeEntry.start} end={new Date()} />
                        )}
                    </strong>
                </Box>
                <Box sx={(theme) => ({
                    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'end'
                    },
                })}>
                    <Menu>
                        {timeEntry.end && (
                            <Menu.Item component={Link} to={`/time-entries/${timeEntry.id}`}>Bearbeiten</Menu.Item>
                        )}


                        <Divider />

                        <deleteFetcher.Form
                            onSubmit={handleDeleteFormSubmit}
                            method="delete"
                            action={`/time-entries/${timeEntry.id}`}>
                            <Menu.Item
                                type="submit"
                                color="red"
                                icon={<IconTrash size={14} />}
                                disabled={
                                    deleteFetcher.state === 'submitting' ||
                                    deleteFetcher.state === 'loading'
                                }>Löschen
                            </Menu.Item>
                        </deleteFetcher.Form>
                    </Menu>
                </Box>
            </Box>
        </Box>
    );
}
