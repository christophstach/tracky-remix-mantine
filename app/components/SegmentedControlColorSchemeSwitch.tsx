import type { ColorScheme } from '@mantine/core';
import { Box, Center, MediaQuery, SegmentedControl } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons';

interface SegmentedControlColorSchemeSwitchProps {
    colorScheme: ColorScheme;
    onChange: (colorScheme: ColorScheme) => void;
}

export function SegmentedControlColorSchemeSwitch(props: SegmentedControlColorSchemeSwitchProps) {
    return (
        <>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <SegmentedControl
                    value={props.colorScheme}
                    onChange={(value: 'light' | 'dark') => props.onChange(value)}
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
                    value={props.colorScheme}
                    onChange={(value: 'light' | 'dark') => props.onChange(value)}
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
        </>
    );
}
