import { Outlet } from '@remix-run/react';
import { Center, useMantineTheme } from '@mantine/core';
import { MetaFunction } from '@remix-run/node';


export const meta: MetaFunction = () => {
    return { title: 'Tracky' };
};


export default function AuthLayout() {
    const theme = useMantineTheme();

    return (
        <Center component="main" sx={{
            width: '100vw',
            height: '100vh',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
        }}>
            <Outlet />
        </Center>
    );
}
