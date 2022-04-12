import { Box, Button, Center, Group, SegmentedControl, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from '@remix-run/react';

export default function HeaderContent() {
    const theme = useMantineTheme();
    const largerThanSm = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    // SegmentedControl verursacht error beim SSR. Weiter beobachten, ob sich das mit einem zukuenftigen Update von
    // Mantine ändert.
    return (
        <Group sx={{ width: '100%' }}>
            <Box sx={{ flex: 1 }}>
                <SegmentedControl
                    value={colorScheme}
                    onChange={(value: 'light' | 'dark') => toggleColorScheme(value)}
                    data={[
                        {
                            value: 'light',
                            label: (
                                <Center>
                                    <IconSun size={16} />
                                    {largerThanSm && <Box ml={10}>Hell</Box>}
                                </Center>
                            ),
                        },
                        {
                            value: 'dark',
                            label: (
                                <Center>
                                    <IconMoon size={16} />
                                    {largerThanSm && <Box ml={10}>Dunkel</Box>}
                                </Center>
                            ),
                        },
                    ]}
                />
            </Box>
            <Box id="header-portal" sx={(theme) => ({ display: 'flex', gap: theme.spacing.xl, alignItems: 'center' })}>

            </Box>
            <Box>
                <Button component={Link} to="/auth/sign-out">Abmelden</Button>
            </Box>
        </Group>
    );
}
