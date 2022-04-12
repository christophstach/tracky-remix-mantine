import React, { ReactElement } from 'react';
import { Button, Center, Container, createStyles, Group, Text, Title } from '@mantine/core';
import { MantineTheme } from '~/components/MantineTheme';
import { Link, Links, LiveReload, Meta, Scripts, ScrollRestoration, } from '@remix-run/react';


const useStyles = createStyles((theme) => ({
    root: {
        height: '100%',
        paddingTop: 80,
        paddingBottom: 120,
        backgroundColor: theme.colors[theme.primaryColor][6],
    },

    label: {
        textAlign: 'center',
        fontWeight: 900,
        fontSize: 220,
        lineHeight: 1,
        marginBottom: theme.spacing.xl * 1.5,
        color: theme.colors[theme.primaryColor][3],

        [theme.fn.smallerThan('sm')]: {
            fontSize: 120,
        },
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        textAlign: 'center',
        fontWeight: 900,
        fontSize: 38,
        color: theme.white,

        [theme.fn.smallerThan('sm')]: {
            fontSize: 32,
        },
    },

    description: {
        margin: 'auto',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl * 1.5,
        color: theme.colors[theme.primaryColor][1],
    },
}));

interface ServerErrorProps {
    onBack: () => void;
    backButtonLabel: string
    statusCode: number
    title: string;
    description: ReactElement | string;

}

export function ServerError(props: ServerErrorProps) {
    const { classes } = useStyles();

    return (
        <html style={{height: '100%'}}>
        <head>
            <title>Oops!</title>
            <Meta />
            <Links />
        </head>
        <body style={{height: '100%'}}>
        <MantineTheme>
            <Center className={classes.root}>
                <Container>
                    <div className={classes.label}>{props.statusCode}</div>
                    <Title className={classes.title}>{props.title}</Title>
                    <Text size="lg" align="center" className={classes.description}>
                        {props.description}
                    </Text>
                    <Group position="center">
                        <Button onClick={props.onBack} variant="white" size="md">
                            {props.backButtonLabel}
                        </Button>
                    </Group>
                </Container>
            </Center>
        </MantineTheme>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        </body>
        </html>
    );
}
