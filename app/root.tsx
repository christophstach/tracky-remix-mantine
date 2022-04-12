import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useCatch,
    useFetcher,
    useLoaderData,
} from '@remix-run/react';
import { setLocale } from 'yup';
import styles from '~/styles/global.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { HtmlMetaDescriptor } from '@remix-run/server-runtime/routeModules';
import { ServerError } from '~/components/ServerError';
import { ColorScheme, Divider } from '@mantine/core';
import { MantineTheme } from '~/components/MantineTheme';
import { NotificationsProvider } from '@mantine/notifications';
import { DataFunctionArgs } from '@remix-run/node';
import { userPreferencesSessionStorage } from '~/services/user-preferences-session.server';
import { yupLocale } from '~/locales/yup-locale';

dayjs.extend(duration);

setLocale(yupLocale);

export function links() {
    return [
        {
            rel: 'stylesheet',
            href: styles,
        },
    ];
}

export function meta(): HtmlMetaDescriptor {
    return {
        charset: 'utf-8',
        title: 'Tracky',
        viewport: 'width=device-width,initial-scale=1',
        description: 'Tracky ist eine Web-Applikation zum Erfassen von Zeiten',
    }
}

export function ErrorBoundary({ error }: { error: Error }) {
    return (
        <ServerError
            onBack={() => window.location.href = '/'}
            backButtonLabel="Zurück zur Startseite"
            statusCode={500}
            title="Unerwarteter Fehler"
            description={
                <>
                    ${error.message}

                    <Divider my="md" />

                    ${error.stack}
                </>
            }
        />
    );
}

export function CatchBoundary() {
    const caught = useCatch();

    return (
        <ServerError
            onBack={() => window.location.href = '/'}
            backButtonLabel="Zurück zur Startseite"
            statusCode={caught.status}
            title={caught.statusText}
            description={caught.data}
        />
    );
}


export async function loader({ request }: DataFunctionArgs) {
    const session = await userPreferencesSessionStorage.getSession(request.headers.get('Cookie'));
    const colorScheme = await session.get('colorScheme');

    return {
        colorScheme
    };
}


export default function App() {
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();
    const fetcher = useFetcher();

    function handleChangeColorScheme(colorScheme: ColorScheme) {
        fetcher.submit({ colorScheme }, { method: 'post', action: '/settings/color-scheme' });
    }

    return (
        <html lang="en">
        <head>
            <Meta />
            <Links />
        </head>
        <body>
        <MantineTheme colorScheme={loaderData.colorScheme} changeColorScheme={handleChangeColorScheme}>
            <NotificationsProvider>
                <Outlet />
            </NotificationsProvider>
        </MantineTheme>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        </body>
        </html>
    );
}
