import { Form, useActionData, useFetcher, useLoaderData, useParams, useTransition } from '@remix-run/react';
import { Card, Group, Select, Textarea, TextInput } from '@mantine/core';
import { db } from '~/services/db.server';
import { DataFunctionArgs, redirect } from '@remix-run/node';
import { badRequest, forbidden, notFound, redirectBack } from 'remix-utils';
import BottomActions from '~/components/BottomActions';
import { authenticator } from '~/services/auth.server';
import { validateUpsertTask } from '~/validators/tasks/upsert-task';


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
    const user = await authenticator.isAuthenticated(request);
    const { success, data, fieldErrors } = await validateUpsertTask(await request.formData());


    if (!id) {
        throw badRequest('Id not set');
    }

    if (!user) {
        throw forbidden('Not allowed');
    }

    if (id !== 'new') {
        const count = await db.task.count({
            where: {
                id,
                project: {
                    client: {
                        user: {
                            id: user.id
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
        await db.task.delete({
            where: {
                id
            }
        });

        return redirect('/tasks');
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
            },
            update: {
                name: data.name,
                description: data.description,
                projectId: data.projectId,
            }
        });

        if (id === 'new') {
            return redirect(`/tasks/${task.id}`);
        } else {
            return redirectBack(request, { fallback: '/' });
        }
    } else {
        return {
            success,
            fieldErrors
        };
    }
}

export async function loader({ params, request }: DataFunctionArgs) {
    const id = params.taskId;
    const user = await authenticator.isAuthenticated(request);

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!user) {
        throw forbidden('User not authenticated');
    }

    if (id !== 'new') {
        const count = await db.task.count({
            where: {
                id,
                project: {
                    client: {
                        user: {
                            id: user.id
                        }
                    }
                }
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
                client: {
                    userId: user.id
                }
            }
        })
    };
}

export default function() {
    const params = useParams();
    const fetcher = useFetcher();
    const transition = useTransition();
    const actionData = useActionData<InferDataFunction<typeof action>>();
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();
    const id = params.clientId;

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
                backLink="/activities"
                showDelete={params.activityId !== 'new'}
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

