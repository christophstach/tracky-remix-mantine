import { Form, useActionData, useFetcher, useLoaderData, useParams, useTransition } from '@remix-run/react';
import { Card, Group, Select, Textarea, TextInput } from '@mantine/core';
import { db } from '~/services/db.server';
import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { badRequest, forbidden, notFound, redirectBack } from 'remix-utils';
import BottomActions from '~/components/BottomActions';
import { authenticator } from '~/services/auth.server';
import { validateUpsertProject } from '~/validators/projects/upsert-project';
import { setNotification } from '~/services/notification-session.server';


export const handle = {
    breadcrumbs(data: InferDataFunction<typeof loader>) {
        const last = data.project ?
            { to: `/projects/${data.project.id}`, label: `${data.project.name}` } :
            { to: '/projects/new', label: 'Neues Projekt' };

        return [
            { to: '/projects', label: 'Projekte' },
            last
        ];
    }
}

export async function action({ request, params }: DataFunctionArgs) {
    const id = params.projectId;
    const userId = await authenticator.isAuthenticated(request);
    const { success, data, fieldErrors } = await validateUpsertProject(await request.formData());

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!userId) {
        throw forbidden('Not allowed');
    }

    if (id !== 'new') {
        const count = await db.project.count({
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
        await db.project.delete({
            where: {
                id
            }
        });

        return redirect('/projects', {
            headers: {
                'Set-Cookie': await setNotification(
                    request.headers.get('Cookie'),
                    'success',
                    'Projekt gelöscht',
                    'Das Projekt wurde erfolgreich gelöscht'
                )
            }
        });
    }

    if (success && data) {
        const project = await db.project.upsert({
            where: {
                id
            },
            create: {
                name: data.name,
                description: data.description,
                clientId: data.clientId,
                userId
            },
            update: {
                name: data.name,
                description: data.description,
                clientId: data.clientId,
                userId
            }
        });

        if (id === 'new') {
            return redirect(`/projects/${project.id}`, {
                headers: {
                    'Set-Cookie': await setNotification(
                        request.headers.get('Cookie'),
                        'success',
                        'Projekt erstellt',
                        'Das Projekt wurde erfolgreich erstellt'
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
                        'Projekt geändert',
                        'Das Projekt wurde erfolgreich geändert'
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
    const id = params.projectId;
    const userId = await authenticator.isAuthenticated(request);

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!userId) {
        throw forbidden('Not allowed');
    }

    if (id !== 'new') {
        const count = await db.project.count({
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
        project: await db.project.findUnique({
            where: {
                id
            },
        }),
        clients: await db.client.findMany({
            orderBy: {
                name: 'asc'
            },
            where: {
                userId: userId
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
    const id = params.projectId;

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
                        defaultValue={loaderData.project?.name} />

                    <Textarea
                        autosize
                        label="Beschreibung"
                        name="description"
                        error={actionData?.fieldErrors?.description}
                        defaultValue={loaderData.project?.description}
                    />

                    <Select
                        clearable
                        searchable
                        data={loaderData.clients.map((client) => {
                            return {
                                value: client.id,
                                label: client.name
                            };
                        })}
                        label="Klient"
                        name="clientId"
                        error={actionData?.fieldErrors?.clientId}
                        defaultValue={loaderData.project?.clientId}
                    />
                </Group>
            </Card>

            <BottomActions
                backLink="/projects"
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

