import type { ColorScheme } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons';

interface ActionIconColorSchemeSwitchProps {
    colorScheme: ColorScheme;
    onChange: (colorScheme: ColorScheme) => void;
}

export function ActionIconColorSchemeSwitch(props: ActionIconColorSchemeSwitchProps) {
    return (
        <ActionIcon
            onClick={() => props.onChange(props.colorScheme === 'light' ? 'dark' : 'light')}
            size="lg"
            radius="xl"
            sx={(theme) => ({
                backgroundColor: props.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: props.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
            })}
        >
            {props.colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
        </ActionIcon>
    );
}
