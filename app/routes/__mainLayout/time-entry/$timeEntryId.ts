import { db } from '~/services/db.server';
import { DataFunctionArgs, redirect } from '@remix-run/node';
import { badRequest, forbidden, notFound } from 'remix-utils';
import { authenticator } from '~/services/auth.server';


export async function action({ request, params }: DataFunctionArgs) {
    const id = params.timeEntryId;
    const user = await authenticator.isAuthenticated(request);

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!user) {
        throw forbidden('Not allowed');
    }

    if (id !== 'new') {
        const count = await db.timeEntry.count({
            where: {
                id,
                task: {
                    project: {
                        client: {
                            user: {
                                id: user.id
                            }
                        }
                    }
                }
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

        return redirect('/timer');
    }
}


