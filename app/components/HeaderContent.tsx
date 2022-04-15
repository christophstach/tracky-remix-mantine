import { ActionIcon, Avatar, Box, Divider, Group, Menu, useMantineColorScheme } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons';
import type { User } from '@prisma/client';
import { Link } from '@remix-run/react';
import Timer from '~/components/Timer';
import { ActionIconColorSchemeSwitch } from '~/components/ActionIconColorSchemeSwitch';

interface HeaderContentProps {
    user: Partial<User> | null;
    start: Date | null | undefined;
    end: Date | null | undefined;
    loading: boolean;
    onStart: () => void;
    onStop: () => void;
}

export default function HeaderContent(props: HeaderContentProps) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const initials = `${props.user?.firstName?.substring(0, 1)}${props.user?.lastName?.substring(0, 1)}`;

    return (
        <Group align="stretch" sx={{ width: '100%' }}>
            <Box sx={{ flex: 1 }}></Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center'
            }}>
                <ActionIconColorSchemeSwitch
                    colorScheme={colorScheme}
                    onChange={toggleColorScheme}
                />
            </Box>
            <Box sx={(theme) => ({
                paddingLeft: theme.spacing.md,
                borderLeftWidth: '1px',
                borderLeftStyle: 'dotted',
                borderLeftColor: '#868e96',
                display: 'flex',
                alignItems: 'center',
                paddingTop: '5px'
            })}>
                <strong>
                    <Timer start={props.start} end={props.end} />
                </strong>
            </Box>
            <Box sx={(theme) => ({
                paddingLeft: theme.spacing.md,
                borderLeftWidth: '1px',
                borderLeftStyle: 'dotted',
                borderLeftColor: '#868e96',
                display: 'flex',
                alignItems: 'center',
            })}>
                {props.start ? (
                    <ActionIcon
                        variant="light"
                        color="indigo"
                        size="lg"
                        radius="xl"
                        loading={props.loading}
                        onClick={props.onStop}
                    >
                        <IconPlayerStop />
                    </ActionIcon>
                ) : (
                    <ActionIcon
                        variant="light"
                        color="indigo"
                        size="lg"
                        radius="xl"
                        loading={props.loading}
                        onClick={props.onStart}
                    >
                        <IconPlayerPlay />
                    </ActionIcon>
                )}

            </Box>
            <Box sx={(theme) => ({
                paddingLeft: theme.spacing.md,
                borderLeftWidth: '1px',
                borderLeftStyle: 'dotted',
                borderLeftColor: '#868e96',
            })}>
                {<Menu
                    sx={{ display: 'block' }}
                    control={initials.trim() ? (
                        <Avatar sx={{ cursor: 'pointer' }} size="md" color="blue" radius="xl">
                            {initials.toUpperCase()}
                        </Avatar>
                    ) : (
                        <Avatar sx={{ cursor: 'pointer' }} size="md" color="blue" radius="xl" />
                    )}
                >
                    <Menu.Item component={Link} to="/profile">
                        Profil
                    </Menu.Item>

                    <Divider />

                    <Menu.Item component={Link} to="/auth/sign-out">
                        Abmelden
                    </Menu.Item>
                </Menu>}
            </Box>
        </Group>
    );
}
