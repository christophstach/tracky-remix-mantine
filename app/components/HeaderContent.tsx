import {
    Box,
    Button,
    Center,
    Group,
    MediaQuery,
    SegmentedControl,
    useMantineColorScheme,
    useMantineTheme
} from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons';
import { Link } from '@remix-run/react';

export default function HeaderContent() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    // SegmentedControl verursacht error beim SSR. Weiter beobachten, ob sich das mit einem zukuenftigen Update von
    // Mantine ändert.
    return (
        <Group sx={{ width: '100%' }}>
            <Box sx={{ flex: 1 }}>
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
            <Box id="header-portal" sx={(theme) => ({ display: 'flex', gap: theme.spacing.xl, alignItems: 'center' })}>

            </Box>
            <Box>
                <Button component={Link} to="/auth/sign-out">Abmelden</Button>
            </Box>
        </Group>
    );
}
