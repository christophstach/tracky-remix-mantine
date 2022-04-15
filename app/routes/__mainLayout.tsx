import {
    Anchor,
    AppShell,
    Breadcrumbs,
    Burger,
    Card,
    Header,
    MediaQuery,
    Navbar,
    ScrollArea,
    useMantineTheme
} from '@mantine/core';
import type { DataFunctionArgs } from '@remix-run/node';
import { MetaFunction } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useMatches, } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';
import { useState } from 'react';
import HeaderContent from '~/components/HeaderContent';
import { IconArrowRight } from '@tabler/icons';
import NavbarContent from '~/components/NavbarContent';
import { db } from '~/services/db.server';

export const meta: MetaFunction = () => {
    return { title: 'Tracky' };
};

export const handle = {
    breadcrumbs: () => {
        return [
            { to: '/', label: 'Tracky' }
        ];
    }
}

export async function loader({ request }: DataFunctionArgs) {
    const userId = await authenticator.isAuthenticated(request, {
        failureRedirect: '/auth/sign-in',
    });

    const user = await db.user.findUnique({
        where: {
            id: userId,
        },
    });

    return { user };
}

export default function MainLayout() {
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();
    const theme = useMantineTheme();
    const [ opened, setOpened ] = useState(false);

    const matches = useMatches();

    const breadcrumbs = matches
        .filter(match => match.handle?.breadcrumbs)
        .flatMap(match => match.handle.breadcrumbs(match.data));

    function handleNavbarLinkClick() {
        setOpened(false);
    }

    return (
        <AppShell
            navbarOffsetBreakpoint="sm"
            fixed
            styles={{
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            }}
            navbar={
                <Navbar
                    p="md"
                    hiddenBreakpoint="sm"
                    hidden={!opened}
                    width={{ sm: 300, lg: 400 }}
                    sx={(theme) => ({
                        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
                    })}
                >
                    <Navbar.Section component={ScrollArea} grow>
                        <NavbarContent onLinkClick={handleNavbarLinkClick} />
                    </Navbar.Section>
                </Navbar>
            }
            header={
                <Header
                    height={60}
                    p="md"
                    sx={{ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white, }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>
                        <HeaderContent user={loaderData.user} />
                    </div>
                </Header>
            }
        >
            <Card sx={{ marginBottom: theme.spacing.md }} shadow="sm" p="md">
                <Breadcrumbs
                    separator={<IconArrowRight size="12pt" />}>
                    {breadcrumbs.map((breadcrumb, index) => {
                        return (
                            <Anchor
                                sx={index > 1 ? {
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                } : {}}
                                component={Link}
                                to={breadcrumb.to}
                                key={index}>{breadcrumb.label}</Anchor>
                        )
                    })}
                </Breadcrumbs>
            </Card>

            <Outlet />
        </AppShell>
    );
}
