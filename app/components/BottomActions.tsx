import { ActionIcon, Box, Button, Card, useMantineTheme } from '@mantine/core';
import { IconArrowBigLeft, IconDeviceFloppy, IconTrash } from '@tabler/icons';
import { Link } from '@remix-run/react';
import React from 'react';
import { useMediaQuery } from '@mantine/hooks';

export interface BottomActionsProps {
    backLink: string;
    showDelete: boolean;
    loading: boolean;
    onDelete: () => void;
}

export default function BottomActions(props: BottomActionsProps) {
    const theme = useMantineTheme();
    const smallerThanMd = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

    return (
        <Card
            shadow="sm"
            p="md"
            mt="md"
            sx={(theme) => ({ display: 'flex', gap: theme.spacing.md })}>
            <Box sx={{ flex: 1 }}>
                {!smallerThanMd ? (
                    <Button
                        leftIcon={<IconArrowBigLeft />}
                        color="gray"
                        component={Link}
                        to={props.backLink}>Zurück</Button>
                ) : (
                    <ActionIcon
                        color="gray"
                        size="lg"
                        variant="filled"
                        component={Link}
                        to={props.backLink}>
                        <IconArrowBigLeft />
                    </ActionIcon>
                )}

            </Box>
            {props.showDelete && (
                <Box>
                    {!smallerThanMd ? (
                        <Button
                            color="red"
                            type="button"
                            leftIcon={<IconTrash />}
                            onClick={props.onDelete}
                            loading={props.loading}
                        >Löschen</Button>
                    ) : (
                        <ActionIcon
                            color="red"
                            type="button"
                            variant="filled"
                            size="lg"
                            onClick={props.onDelete}
                            loading={props.loading}
                        >
                            <IconTrash />
                        </ActionIcon>
                    )}
                </Box>
            )}
            <Box>
                {!smallerThanMd ? (
                    <Button
                        type="submit"
                        leftIcon={<IconDeviceFloppy />}
                        loading={props.loading}
                    >Speichern</Button>
                ) : (
                    <ActionIcon
                        color="blue"
                        type="submit"
                        variant="filled"
                        size="lg"
                        loading={props.loading}
                    >
                        <IconDeviceFloppy />
                    </ActionIcon>
                )}
            </Box>
        </Card>
    );
}
