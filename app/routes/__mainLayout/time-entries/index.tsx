import type { DataFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { badRequest, forbidden, redirectBack } from 'remix-utils';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { TimEntryRow } from '~/components/TimEntryRow';
import { setNotification } from '~/services/notification-session.server';
import { validateUpdateTimeEntry } from '~/validators/time-entries/updateTimeEntry';

export const handle = {
    breadcrumbs: () => {
        return [
            { to: '/time-entries', label: 'Zeiterfassungen' }
        ];
    }
}

export async function action({ request, params }: DataFunctionArgs) {
    const userId = await authenticator.isAuthenticated(request);
    const { success, data, fieldErrors } = await validateUpdateTimeEntry(await request.formData());
    const id = data?.id;

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!userId) {
        throw forbidden('Not allowed');
    }

    if (success && data) {
        await db.timeEntry.update({
            data: {
                text: data.text,
            },
            where: { id },
        })

        return redirectBack(request, {
            fallback: '/',
            headers: {
                'Set-Cookie': await setNotification(
                    request.headers.get('Cookie'),
                    'success',
                    'Zeiteintrag geändert',
                    'Der Zeiteintrag wurde erfolgreich geändert'
                )
            }
        });
    } else {
        return { fieldErrors };
    }
}

export async function loader({ request }: DataFunctionArgs) {
    const userId = await authenticator.isAuthenticated(request);

    if (!userId) {
        throw forbidden('Not allowed');
    }


    const timeEntries = await db.timeEntry.findMany({
        orderBy: {
            start: 'desc'
        },
        include: {
            task: {
                include: {
                    project: {
                        include: {
                            client: true
                        }
                    }
                }
            }
        },
        where: {
            userId
        }
    });

    const tasks = await db.task.findMany({
        orderBy: [
            {
                name: 'asc',
            },
            {
                project: {
                    name: 'asc',
                }
            },
            {
                project: {
                    client: {
                        name: 'asc',
                    }
                }
            }
        ],
        where: {
            userId
        },
        include: {
            project: {
                include: {
                    client: true
                }
            }
        }
    });

    return { timeEntries, tasks };
}

export default function TimerIndex() {
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();

    return (
        <>
            {loaderData.timeEntries.map((timeEntry) => {
                return (
                    <TimEntryRow
                        key={timeEntry.id}
                        timeEntry={timeEntry}
                        task={timeEntry.task}
                        project={timeEntry.task?.project}
                        client={timeEntry.task?.project?.client}
                    />
                );
            })}
        </>
    );
}
