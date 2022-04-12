import type { MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, } from '@remix-run/react';
import styles from '~/styles/global.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);


export function links() {
    return [
        {
            rel: 'stylesheet',
            href: styles,
        },
    ];
}

export const meta: MetaFunction = () => ({
    charset: 'utf-8',
    title: 'Tracky',
    viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
    return (
        <html style={{ height: '100%' }} lang="en">
        <head>
            <Meta />
            <Links />
        </head>
        <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        </body>
        </html>
    );
}
