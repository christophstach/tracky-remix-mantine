import { ActionIcon, Box, Button, Card, MediaQuery } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import React from 'react';
import { Link } from '@remix-run/react';

export interface TopActionsProps {
    addLink: string;
}

export default function TopActions(props: TopActionsProps) {
    const buttonVariant = 'light';

    return (
        <Card
            shadow="sm"
            p="md"
            my="md"
            sx={(theme) => ({ display: 'flex', gap: theme.spacing.md })}>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'end' }}>
                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                    <Button
                        leftIcon={<IconPlus />}
                        color="indigo"
                        variant={buttonVariant}
                        component={Link}
                        to={props.addLink}
                    >Neu</Button>
                </MediaQuery>

                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <ActionIcon
                        color="indigo"
                        size="lg"
                        variant={buttonVariant}
                        component={Link}
                        to={props.addLink}
                    >
                        <IconPlus />
                    </ActionIcon>
                </MediaQuery>
            </Box>
        </Card>
    );
}
