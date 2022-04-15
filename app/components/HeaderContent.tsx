import {
    Avatar,
    Box,
    Center,
    Divider,
    Group,
    MediaQuery,
    Menu,
    SegmentedControl,
    useMantineColorScheme
} from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons';
import { User } from '@prisma/client';
import { Link } from '@remix-run/react';

interface HeaderContentProps {
    user: Partial<User> | null;
}

export default function HeaderContent(props: HeaderContentProps) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const initials = `${props.user?.firstName?.substring(0, 1)}${props.user?.lastName?.substring(0, 1)}`;

    return (
        <Group sx={{ width: '100%' }}>
            <Box sx={{ flex: 1, textAlign: 'right' }}>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <SegmentedControl
                        value={colorScheme}
                        onChange={(value: 'light' | 'dark') => toggleColorScheme(value)}
                        data={[
                            {
                                value: 'light',
                                label: (
                                    <Center>
                                        <IconSun size={16} />
                                    </Center>
                                ),
                            },
                            {
                                value: 'dark',
                                label: (
                                    <Center>
                                        <IconMoon size={16} />
                                    </Center>
                                ),
                            },
                        ]}
                    />
                </MediaQuery>

                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                    <SegmentedControl
                        value={colorScheme}
                        onChange={(value: 'light' | 'dark') => toggleColorScheme(value)}
                        data={[
                            {
                                value: 'light',
                                label: (
                                    <Center>
                                        <IconSun size={16} />
                                        <Box ml={10}>Hell</Box>
                                    </Center>
                                ),
                            },
                            {
                                value: 'dark',
                                label: (
                                    <Center>
                                        <IconMoon size={16} />
                                        <Box ml={10}>Dunkel</Box>
                                    </Center>
                                ),
                            },
                        ]}
                    />
                </MediaQuery>


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
                        <Avatar sx={{cursor: 'pointer'}} size="md" color="blue" radius="xl">
                            {initials.toUpperCase()}
                        </Avatar>
                    ) : (
                        <Avatar sx={{cursor: 'pointer'}} size="md" color="blue" radius="xl" />
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
