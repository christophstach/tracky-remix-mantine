import type { ReactNode } from 'react';
import type { ColorScheme } from '@mantine/core';
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';


interface MantineThemeProps {
    colorScheme: ColorScheme;
    children: ReactNode;
    changeColorScheme?: (colorTheme: ColorScheme) => void;
}

export function MantineTheme(props: MantineThemeProps) {
    function handleToggleColorScheme(colorScheme: ColorScheme) {
        if (props.changeColorScheme) {
            props.changeColorScheme(colorScheme);
        }
    }

    return (
        <ColorSchemeProvider colorScheme={props.colorScheme} toggleColorScheme={handleToggleColorScheme}>
            <MantineProvider
                defaultProps={{
                    ThemeIcon: {
                        p: '3px'
                    },
                    ActionIcon: {
                        p: '3px'
                    }
                }}
                theme={{ colorScheme: props.colorScheme }}
                withNormalizeCSS
                withGlobalStyles
            >
                {props.children}
            </MantineProvider>
        </ColorSchemeProvider>
    );
}
