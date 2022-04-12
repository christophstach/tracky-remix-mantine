import React, { useState } from 'react';
import { Box, Collapse, createStyles, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, TablerIcon } from '@tabler/icons';

import { MantineColor } from '@mantine/styles';
import { Link, useLocation } from '@remix-run/react';


const useStyles = createStyles((theme) => ({
    control: {
        fontWeight: 500,
        display: 'block',
        width: '100%',
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        fontSize: theme.fontSizes.sm,
        borderRadius: theme.radius.md,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },

    link: {
        fontWeight: 500,
        display: 'block',
        textDecoration: 'none',
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        paddingLeft: 31,
        marginLeft: 30,
        borderBottomRightRadius: theme.radius.md,
        borderTopRightRadius: theme.radius.md,
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        borderLeft: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },

    linkActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },

    chevron: {
        transition: 'transform 200ms ease',
    },
}));

interface NavbarCollapsibleLinksGroupProps {
    icon: TablerIcon;
    iconColor: MantineColor;
    label: string;
    initiallyOpened?: boolean;
    links: {
        label: string;
        to: string,
        exact?: boolean;
        onClick?: () => void;
    }[];
}

export function NavbarCollapsibleLinksGroup(props: NavbarCollapsibleLinksGroupProps) {
    const location = useLocation();
    const { classes, theme } = useStyles();
    const hasLinks = Array.isArray(props.links);
    const hasActiveLinks = props.links.some((link) => {
        return link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);
    });
    const [ opened, setOpened ] = useState(hasActiveLinks || !!props.initiallyOpened);
    const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;
    const items = (hasLinks ? props.links : []).map((link, index) => {
        const active = link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);

        return (
            <Text
                component={Link}
                className={`${classes.link} ${active ? classes.linkActive : ''}`}
                to={link.to}
                key={index}
                onClick={link.onClick}
            >
                {link.label}
            </Text>
        );
    });

    return (
        <>
            <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
                <Group position="apart" spacing={0}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ThemeIcon variant="light" size={30} color={props.iconColor}>
                            <props.icon size={18} />
                        </ThemeIcon>
                        <Box ml="md">{props.label}</Box>
                    </Box>
                    {hasLinks && (
                        <ChevronIcon
                            className={classes.chevron}
                            size={14}
                            style={{
                                transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
                            }}
                        />
                    )}
                </Group>
            </UnstyledButton>
            {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    );
}
