import { DataFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { forbidden, redirectBack } from 'remix-utils';
import { db } from '~/services/db.server';
import { setNotification } from '~/services/notification-session.server';

export async function action({ request }: DataFunctionArgs) {
    const userId = await authenticator.isAuthenticated(request);
    if (!userId) {
        throw forbidden('Not allowed');
    }

    await db.timeEntry.updateMany({
        data: {
            end: new Date(),
        },
        where: {
            end: null,
            userId
        }
    });

    return redirectBack(request, {
        fallback: '/time-entries',
        headers: {
            'Set-Cookie': await setNotification(
                request.headers.get('Cookie'),
                'success',
                'Timer gestoppt',
                'Der Timer wurde erfolgreich gestoppt'
            )
        }
    });

}
