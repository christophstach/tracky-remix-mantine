import { createCookieSessionStorage } from '@remix-run/node';

const authSessionSecret = process.env.AUTH_SESSION_SECRET;
const authSessionCookieName = process.env.AUTH_SESSION_COOKIE_NAME;

if (!authSessionSecret) {
    throw new Error('AUTH_SESSION_SECRET must be set');
}

if (!authSessionCookieName) {
    throw new Error('AUTH_SESSION_COOKIE_NAME must be set');
}

export const authSessionStorage = createCookieSessionStorage({
    cookie: {
        name: authSessionCookieName,
        // normally you want this to be `secure: true`
        // but that doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: process.env.NODE_ENV === 'production',
        secrets: [ authSessionSecret ],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true
    }
});
