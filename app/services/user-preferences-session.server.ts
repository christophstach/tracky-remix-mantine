import { createCookieSessionStorage } from '@remix-run/node';

const userPreferencesSessionSecret = process.env.USER_PREFERENCES_SESSION_SECRET;
const userPreferencesSessionCookieName = process.env.USER_PREFERENCES_SESSION_COOKIE_NAME;

if (!userPreferencesSessionSecret) {
    throw new Error('USER_PREFERENCES_SESSION_SECRET must be set');
}

if (!userPreferencesSessionCookieName) {
    throw new Error('USER_PREFERENCES_SESSION_COOKIE_NAME must be set');
}

export const userPreferencesSessionStorage = createCookieSessionStorage({
    cookie: {
        name: userPreferencesSessionCookieName,
        // normally you want this to be `secure: true`
        // but that doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: process.env.NODE_ENV === 'production',
        secrets: [ userPreferencesSessionSecret ],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true
    }
});
