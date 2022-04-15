import { db } from '~/services/db.server';
import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { badRequest, forbidden, notFound } from 'remix-utils';
import { authenticator } from '~/services/auth.server';
import { setNotification } from '~/services/notification-session.server';


export async function action({ request, params }: DataFunctionArgs) {
    const id = params.timeEntryId;
    const userId = await authenticator.isAuthenticated(request);

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!userId) {
        throw forbidden('Not allowed');
    }

    if (id !== 'new') {
        const count = await db.timeEntry.count({
            where: {
                id,
                userId
            }
        });

        if (count === 0) {
            throw notFound('Not found');
        }
    }

    if (request.method === 'DELETE') {
        await db.timeEntry.delete({
            where: {
                id
            }
        });

        return redirect('/time-entries', {
            headers: {
                'Set-Cookie': await setNotification(
                    request.headers.get('Cookie'),
                    'success',
                    'Zeiteintrag gelöscht',
                    'Der Zeiteintrag wurde erfolgreich gelöscht'
                )
            }
        });
    }
}


