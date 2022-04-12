import { Box, createStyles, Group, ThemeIcon } from '@mantine/core';
import { Link, useLocation } from '@remix-run/react';

import { MantineColor } from '@mantine/styles';

import { TablerIcon } from '@tabler/icons';
import React from 'react';

interface NavbarLinkProps {
    label: string
    to: string
    icon: TablerIcon
    iconColor: MantineColor;
    exact?: boolean;
    onClick?: () => void;
}

const useStyles = createStyles((theme) => ({
    link: {
        fontWeight: 500,
        display: 'block',
        width: '100%',
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        fontSize: theme.fontSizes.sm,
        borderRadius: theme.radius.md,
        textDecoration: 'none',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },


    linkActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },

}));

export default function NavbarLink(props: NavbarLinkProps) {
    const location = useLocation();
    const { classes } = useStyles();
    const active = props.exact ? location.pathname === props.to : location.pathname.startsWith(props.to);

    return (
        <Link to={props.to} className={`${classes.link} ${active ? classes.linkActive : ''}`} onClick={props.onClick}>
            <Group position="apart" spacing={0}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ThemeIcon variant="light" size={30} color={props.iconColor}>
                        <props.icon size={18} />
                    </ThemeIcon>
                    <Box ml="md">{props.label}</Box>
                </Box>
            </Group>
        </Link>
    );
}
