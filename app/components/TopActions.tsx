import { ActionIcon, Button, useMantineTheme } from '@mantine/core';
import { IconDeviceFloppy, IconPlus } from '@tabler/icons';
import { Link } from '@remix-run/react';
import React from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { HeaderPortal } from '~/components/HeaderPortal';

export interface TopActionsProps {
    addLink: string;
}

export default function TopActions(props: TopActionsProps) {
    const theme = useMantineTheme();
    const largerThanSm = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);

    return (
        <HeaderPortal>
            {largerThanSm ? (
                <Button
                    component={Link}
                    to={props.addLink}
                    leftIcon={<IconPlus />}
                >Neu</Button>
            ) : (
                <ActionIcon
                    component={Link}
                    to={props.addLink}
                    color="blue"
                    variant="filled"
                    size="lg"
                >
                    <IconPlus />
                </ActionIcon>
            )}
        </HeaderPortal>
    );
}
