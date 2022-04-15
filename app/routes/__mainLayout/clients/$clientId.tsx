import { Form, useActionData, useFetcher, useLoaderData, useParams, useTransition } from '@remix-run/react';
import { Card, Group, Textarea, TextInput } from '@mantine/core';
import { db } from '~/services/db.server';
import { DataFunctionArgs, redirect } from '@remix-run/node';
import { badRequest, forbidden, notFound, redirectBack } from 'remix-utils';
import BottomActions from '~/components/BottomActions';
import { validateUpsertClient } from '~/validators/clients/upsert-client';
import { authenticator } from '~/services/auth.server';
import { setNotification } from '~/services/notification-session.server';


export const handle = {
    breadcrumbs(data: InferDataFunction<typeof loader>) {
        const last = data.client ?
            { to: `/clients/${data.client.id}`, label: `${data.client.name}` } :
            { to: '/clients/new', label: 'Neuer Klient' };

        return [
            { to: '/clients', label: 'Klienten' },
            last
        ];
    }
}

export async function action({ request, params }: DataFunctionArgs) {
    const id = params.clientId;
    const userId = await authenticator.isAuthenticated(request);
    const { success, data, fieldErrors } = await validateUpsertClient(await request.formData());

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!userId) {
        throw forbidden('Not allowed');
    }

    if (id !== 'new') {
        const count = await db.client.count({
            where: {
                id,
                user: {
                    id: userId
                }
            }
        });

        if (count === 0) {
            throw notFound('Not found');
        }
    }

    if (request.method === 'DELETE') {
        await db.client.delete({
            where: {
                id
            }
        });

        return redirect('/clients');
    }

    if (success && data) {
        const client = await db.client.upsert({
            where: {
                id
            },
            create: {
                name: data.name,
                description: data.description,
                user: {
                    connect: {
                        id: userId
                    }
                }
            },
            update: {
                name: data.name,
                description: data.description,
            }
        });

        if (id === 'new') {
            return redirect(`/clients/${client.id}`, {
                headers: {
                    'Set-Cookie': await setNotification(
                        request.headers.get('Cookie'),
                        'success',
                        'Klient erstellt',
                        'Der Klient wurde erfolgreich erstellt'
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
                        'Klient geändert',
                        'Der Klient wurde erfolgreich geändert'
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
    const id = params.clientId;
    const userId = await authenticator.isAuthenticated(request);

    if (!id) {
        throw badRequest('Id not set');
    }

    if (!userId) {
        throw forbidden('Not allowed');
    }

    if (id !== 'new') {
        const count = await db.client.count({
            where: {
                id,
                user: {
                    id: userId
                }
            }
        });

        if (count === 0) {
            throw notFound('Not found');
        }
    }

    return {
        client: await db.client.findUnique({
            where: {
                id
            },
        }),
    };
}

export default function () {
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
                        defaultValue={loaderData.client?.name} />

                    <Textarea
                        autosize
                        label="Beschreibung"
                        name="description"
                        error={actionData?.fieldErrors?.description}
                        defaultValue={loaderData.client?.description}
                    />
                </Group>
            </Card>

            <BottomActions
                backLink="/clients"
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

