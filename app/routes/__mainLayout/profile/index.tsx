import { DataFunctionArgs } from '@remix-run/node';
import { Card, Group, TextInput } from '@mantine/core';
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react';
import BottomActions from '~/components/BottomActions';
import { authenticator } from '~/services/auth.server';
import { forbidden, redirectBack } from 'remix-utils';
import { validateProfile } from '~/validators/profile/profile';
import { db } from '~/services/db.server';
import { setNotification } from '~/services/notification-session.server';


export const handle = {
    breadcrumbs() {
        return [
            { to: '/profile', label: 'Profil' },
        ];
    }
}

export async function action({ request }: DataFunctionArgs) {
    const userId = await authenticator.isAuthenticated(request);

    if (!userId) {
        throw forbidden('Not allowed');
    }

    const { success, data, fieldErrors } = await validateProfile(await request.formData(), userId);

    if (success && data) {
        await db.user.update({
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
            },
            where: {
                id: userId
            }
        });

        return redirectBack(request, {
            fallback: '/',
            headers: {
                'Set-Cookie': await setNotification(
                    request.headers.get('Cookie'),
                    'success',
                    'Profil gespeichert',
                    'Ihr Profil wurde erfolgreich gespeichert'
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

    const user = await db.user.findUnique({
        where: {
            id: userId
        }
    });

    return { user };
}

export default function () {
    const transition = useTransition();
    const actionData = useActionData<InferDataFunction<typeof action>>();
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();

    return (
        <Form method="post">
            <Card shadow="sm" p="md">
                <Group direction="column" grow>
                    <TextInput
                        autoFocus
                        label="E-Mail"
                        autoComplete="off"
                        name="email"
                        error={actionData?.fieldErrors?.email}
                        defaultValue={loaderData.user?.email}
                    />

                    <TextInput
                        autoFocus
                        label="Vorname"
                        autoComplete="off"
                        name="firstName"
                        error={actionData?.fieldErrors?.firstName}
                        defaultValue={loaderData.user?.firstName}
                    />

                    <TextInput
                        autoFocus
                        label="Nachname"
                        autoComplete="off"
                        name="lastName"
                        error={actionData?.fieldErrors?.lastName}
                        defaultValue={loaderData.user?.lastName}
                    />
                </Group>
            </Card>

            <BottomActions
                backLink="/"
                loading={
                    transition.state === 'loading' ||
                    transition.state === 'submitting'
                }
            />
        </Form>
    );
}
