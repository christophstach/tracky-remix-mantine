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
                opacity: '0.4',
                // backgroundImage: 'url(\'/sonja-langford-eIkbSc3SDtI-unsplash.jpg\')',
                // backgroundImage: 'url(\'/pexels-shawn-stutzman-1010513.jpg\')',
                backgroundImage: 'url(\'/kevin-andre-ePBkyKJP77A-unsplash.jpg\')',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '0px -1300px',
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
    const { classes, theme } = useStyles();


    return (
        <Box className={classes.pageWrapper}>
            <Center className={classes.page}>
                <Outlet />

                <Box sx={{ position: 'absolute', bottom: 0, right: 0, padding: theme.spacing.xs }}>
                    Photo by <a
                    href="https://unsplash.com/@kevinandrephotography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Kevin
                    Andre</a> on <a
                    href="https://unsplash.com/s/photos/stop-watch?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                </Box>
            </Center>
        </Box>


    );
}
