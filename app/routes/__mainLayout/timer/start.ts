import type { DataFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { forbidden, redirectBack } from 'remix-utils';
import { db } from '~/services/db.server';
import { setNotification } from '~/services/notification-session.server';

export async function action({ request }: DataFunctionArgs) {
    const userId = await authenticator.isAuthenticated(request);

    if (!userId) {
        throw forbidden('Not allowed');
    }

    const currentTimeEntry = await db.timeEntry.findFirst({
        where: {
            userId,
            end: null
        }
    });

    if (!currentTimeEntry) {
        await db.timeEntry.create({
            data: {
                start: new Date(),
                end: null,
                userId
            }
        });
    }


    return redirectBack(request, {
        fallback: '/time-entries',
        headers: {
            'Set-Cookie': await setNotification(
                request.headers.get('Cookie'),
                'success',
                'Timer gestartet',
                'Der Timer wurde erfolgreich gestartet'
            )
        }
    });
}
