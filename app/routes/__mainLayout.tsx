import { Box, Center, createStyles } from '@mantine/core';
import type { DataFunctionArgs } from '@remix-run/node';
import { Outlet, } from '@remix-run/react';

const useStyles = createStyles((theme, _params, getRef) => {
    return {
        pageWrapper: {
            position: 'relative',
            height: '100%',

            '&::before': {
                content: '\'\'',
                display: 'block',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                opacity: '0.2',
                backgroundImage: 'url(\'/sonja-langford-eIkbSc3SDtI-unsplash.jpg\')',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '50% 0',
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
            }
        },

        page: {
            position: 'relative',
            overflow: 'auto',
            minHeight: '100%'
        }
    }
});

export const handle = {
    breadcrumbs: () => {
        return [
            { to: '/', label: 'NBHS' }
        ];
    }
}

export async function loader({ request }: DataFunctionArgs) {
    return {};
}

export default function MainLayout() {
    const { classes } = useStyles();


    return (
        <Box className={classes.pageWrapper}>
            <Center className={classes.page}>
                <Outlet />
            </Center>
        </Box>
    );
}
