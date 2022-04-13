import { Form, useActionData, useFetcher, useLoaderData, useParams, useTransition } from '@remix-run/react';

import { Card, Group, Select, Textarea, TextInput } from '@mantine/core';
import React from 'react';

import { db } from '~/services/db.server';

import { DataFunctionArgs, redirect } from '@remix-run/node';
import { badRequest, forbidden, notFound, redirectBack } from 'remix-utils';
import BottomActions from '~/components/BottomActions';
import { authenticator } from '~/services/auth.server';
import { validateUpsertActivity } from '~/validators/activities/upsert-activity';


export const handle = {
    breadcrumbs(data: InferDataFunction<typeof loader>) {
        const last = data.activity ?
            { to: `/activities/${data.activity.id}`, label: `${data.activity.name}` } :
            { to: '/activities/new', label: 'Neue Tätigkeit' };

        return [
            { to: '/activities', label: 'Tätigkeiten' },
            last
        ];
    }
}

export async function action({ request, params }: DataFunctionArgs) {
    const id = params.activityId;
    const user = await authenticator.isAuthenticated(request);
    const { success, data, fieldErrors } = await validateUpsertActivity(await request.formData());


    if (!id) {
        throw badRequest('Id not set');
    }

    if (!user) {
        throw forbidden('Not allowed');
    }

    if (id !== 'new') {
        const count = await db.activity.count({
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
        await db.activity.delete({
            where: {
                id
            }
        });

        return redirect('/activities');
    }

    if (success && data) {
        const activity = await db.activity.upsert({
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
            return redirect(`/activities/${activity.id}`);
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
    const id = params.activityId;
    const user = await authenticator.isAuthenticated(request);

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!user) {
        throw forbidden('User not authenticated');
    }

    if (id !== 'new') {
        const count = await db.activity.count({
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
        activity: await db.activity.findUnique({
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

export default function Projects$projectId$() {
    const params = useParams();
    const fetcher = useFetcher();
    const transition = useTransition();
    const actionData = useActionData<InferDataFunction<typeof action>>();
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();

    function handleDelete() {
        fetcher.submit(null, { method: 'delete' });
    }

    return (
        <Form method={params.areaId === 'new' ? 'post' : 'put'}>
            <Card shadow="sm" p="md">
                <Group direction="column" grow>
                    <TextInput
                        autoFocus
                        label="Name"
                        autoComplete="off"
                        name="name"
                        error={actionData?.fieldErrors?.name}
                        defaultValue={loaderData.activity?.name} />

                    <Textarea
                        autosize
                        label="Beschreibung"
                        name="description"
                        error={actionData?.fieldErrors?.description}
                        defaultValue={loaderData.activity?.description}
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
                        defaultValue={loaderData.activity?.projectId}
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

