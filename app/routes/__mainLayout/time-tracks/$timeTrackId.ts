import { db } from '~/services/db.server';
import { DataFunctionArgs, redirect } from '@remix-run/node';
import { badRequest, forbidden, notFound, redirectBack } from 'remix-utils';
import { authenticator } from '~/services/auth.server';


export async function action({ request, params }: DataFunctionArgs) {
    const id = params.timeTrackId;
    const user = await authenticator.isAuthenticated(request);

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!user) {
        throw forbidden('Not allowed');
    }

    if (id !== 'new') {
        const count = await db.timeTrack.count({
            where: {
                id,
                activity: {
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
        await db.timeTrack.delete({
            where: {
                id
            }
        });

        return redirect('/timer');
    }
}


