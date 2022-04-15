import { createCookieSessionStorage } from '@remix-run/node';

const notificationSessionSecret = process.env.NOTIFICATION_SESSION_SECRET;
const notificationSessionCookieName = process.env.NOTIFICATION_SESSION_COOKIE_NAME;

if (!notificationSessionSecret) {
    throw new Error('NOTIFICATION_SESSION_SECRET must be set');
}

if (!notificationSessionCookieName) {
    throw new Error('NOTIFICATION_SESSION_COOKIE_NAME must be set');
}

export const notificationSessionStorage = createCookieSessionStorage({
    cookie: {
        name: notificationSessionCookieName,
        // normally you want this to be `secure: true`
        // but that doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: process.env.NODE_ENV === 'production',
        secrets: [ notificationSessionSecret ],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true
    }
});

export async function setNotification(cookieHeader: string | null | undefined, type: 'success' | 'error', title: string, message: string) {
    const session = await notificationSessionStorage.getSession(cookieHeader);

    session.flash('notification', {
        type,
        message
    });

    return await notificationSessionStorage.commitSession(session);
}
