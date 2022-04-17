import { ActionIcon, Box, Button, Card, MediaQuery } from '@mantine/core';
import { IconArrowBigLeft, IconDeviceFloppy, IconTrash } from '@tabler/icons';
import { Link, useNavigate } from '@remix-run/react';
import React from 'react';

export interface BottomActionsProps {
    backLink: string;
    loading: boolean;
    showDelete?: boolean;
    onDelete?: () => void;
}

export default function BottomActions(props: BottomActionsProps) {
    const buttonVariant = 'light';

    return (
        <Card
            shadow="sm"
            p="md"
            mt="md"
            sx={(theme) => ({ display: 'flex', gap: theme.spacing.md })}>
            <Box sx={{ flex: 1 }}>
                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                    <Button
                        leftIcon={<IconArrowBigLeft />}
                        color="gray"
                        variant={buttonVariant}
                        component={Link}
                        to={props.backLink}>Zurück</Button>
                </MediaQuery>

                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <ActionIcon
                        color="gray"
                        size="lg"
                        variant={buttonVariant}
                        component={Link}
                        to={props.backLink}>
                        <IconArrowBigLeft />
                    </ActionIcon>
                </MediaQuery>

            </Box>
            {props.showDelete && (
                <Box>
                    <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                        <Button
                            color="red"
                            type="button"
                            variant={buttonVariant}
                            leftIcon={<IconTrash />}
                            onClick={props.onDelete}
                            loading={props.loading}
                        >Löschen</Button>
                    </MediaQuery>

                    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                        <ActionIcon
                            color="red"
                            type="button"
                            variant={buttonVariant}
                            size="lg"
                            onClick={props.onDelete}
                            loading={props.loading}
                        >
                            <IconTrash />
                        </ActionIcon>
                    </MediaQuery>
                </Box>
            )}
            <Box>
                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                    <Button
                        type="submit"
                        variant={buttonVariant}
                        leftIcon={<IconDeviceFloppy />}
                        loading={props.loading}
                    >Speichern</Button>
                </MediaQuery>

                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <ActionIcon
                        color="blue"
                        type="submit"
                        size="lg"
                        variant={buttonVariant}
                        loading={props.loading}
                    >
                        <IconDeviceFloppy />
                    </ActionIcon>
                </MediaQuery>
            </Box>
        </Card>
    );
}
