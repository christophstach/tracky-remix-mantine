import { Form, useActionData, useFetcher, useLoaderData, useParams, useTransition } from '@remix-run/react';
import { Card, Group, Select, Textarea, TextInput } from '@mantine/core';
import { db } from '~/services/db.server';
import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { badRequest, forbidden, notFound, redirectBack } from 'remix-utils';
import BottomActions from '~/components/BottomActions';
import { authenticator } from '~/services/auth.server';
import { validateUpsertTask } from '~/validators/tasks/upsert-task';
import { setNotification } from '~/services/notification-session.server';


export const handle = {
    breadcrumbs(data: InferDataFunction<typeof loader>) {
        const last = data.task ?
            { to: `/tasks/${data.task.id}`, label: `${data.task.name}` } :
            { to: '/tasks/new', label: 'Neue Tätigkeit' };

        return [
            { to: '/tasks', label: 'Tätigkeiten' },
            last
        ];
    }
}

export async function action({ request, params }: DataFunctionArgs) {
    const id = params.taskId;
    const userId = await authenticator.isAuthenticated(request);
    const { success, data, fieldErrors } = await validateUpsertTask(await request.formData());

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!userId) {
        throw forbidden('Not allowed');
    }

    if (id !== 'new') {
        const count = await db.task.count({
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
        await db.task.delete({
            where: {
                id
            }
        });

        return redirect('/tasks', {
            headers: {
                'Set-Cookie': await setNotification(
                    request.headers.get('Cookie'),
                    'success',
                    'Tätigkeit gelöscht',
                    'Die Tätigkeit wurde erfolgreich gelöscht'
                )
            }
        });
    }

    if (success && data) {
        const task = await db.task.upsert({
            where: {
                id
            },
            create: {
                name: data.name,
                description: data.description,
                projectId: data.projectId,
                userId,
            },
            update: {
                name: data.name,
                description: data.description,
                projectId: data.projectId,
                userId
            }
        });

        if (id === 'new') {
            return redirect(`/tasks/${task.id}`, {
                headers: {
                    'Set-Cookie': await setNotification(
                        request.headers.get('Cookie'),
                        'success',
                        'Tätigkeit erstellt',
                        'Die Tätigkeit wurde erfolgreich erstellt'
                    )
                }
            });
        } else {
            return redirectBack(request, {
                fallback: '/',
                headers: {
                    'Set-Cookie': await setNotification(
                        request.headers.get('Cookie'),
                        'success',
                        'Tätigkeit geändert',
                        'Die Tätigkeit wurde erfolgreich geändert'
                    )
                }
            });
        }
    } else {
        return {
            fieldErrors
        };
    }
}

export async function loader({ params, request }: DataFunctionArgs) {
    const id = params.taskId;
    const userId = await authenticator.isAuthenticated(request);

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!userId) {
        throw forbidden('User not authenticated');
    }

    if (id !== 'new') {
        const count = await db.task.count({
            where: {
                id,
                userId
            }
        });

        if (count === 0) {
            throw notFound('Not found');
        }
    }

    return {
        task: await db.task.findUnique({
            where: {
                id
            },
        }),
        projects: await db.project.findMany({
            orderBy: {
                name: 'asc'
            },
            where: {
                userId
            }
        })
    };
}

export default function () {
    const params = useParams();
    const fetcher = useFetcher();
    const transition = useTransition();
    const actionData = useActionData<InferDataFunction<typeof action>>();
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();
    const id = params.taskId;

    function handleDelete() {
        fetcher.submit(null, { method: 'delete' });
    }

    return (
        <Form method={id === 'new' ? 'post' : 'put'}>
            <Card shadow="sm" p="md">
                <Group direction="column" grow>
                    <TextInput
                        autoFocus
                        label="Name"
                        autoComplete="off"
                        name="name"
                        error={actionData?.fieldErrors?.name}
                        defaultValue={loaderData.task?.name} />

                    <Textarea
                        autosize
                        label="Beschreibung"
                        name="description"
                        error={actionData?.fieldErrors?.description}
                        defaultValue={loaderData.task?.description}
                    />

                    <Select
                        clearable
                        searchable
                        data={loaderData.projects.map((client) => {
                            return {
                                value: client.id,
                                label: client.name
                            };
                        })}
                        label="Projekt"
                        name="projectId"
                        error={actionData?.fieldErrors?.projectId}
                        defaultValue={loaderData.task?.projectId}
                    />
                </Group>
            </Card>

            <BottomActions
                backLink="/tasks"
                showDelete={id !== 'new'}
                loading={
                    transition.state === 'loading' ||
                    transition.state === 'submitting' ||
                    fetcher.state === 'loading' ||
                    fetcher.state === 'submitting'
                }
                onDelete={handleDelete}
            />
        </Form>
    );
}

