import { Form, Link, useActionData, useTransition } from '@remix-run/react';

import { Alert, Box, Button, Card, Divider, Group, PasswordInput, TextInput } from '@mantine/core';
import { DataFunctionArgs, MetaFunction } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { AuthorizationError } from 'remix-auth';
import { validateSignIn } from '~/validators/auth/sign-in';
import { unauthorized } from 'remix-utils';

export const meta: MetaFunction = () => {
    return {
        title: 'Tracky: Anmelden'
    };
};

export async function action({ request }: DataFunctionArgs) {
    const formData = await request.formData();
    const { success, fieldErrors } = await validateSignIn(formData);

    if (success) {
        try {
            await authenticator.authenticate('form', request, {
                successRedirect: '/timer',
                throwOnError: true,
                context: formData, // optional
            });
        } catch (error) {
            if (error instanceof Response) {
                return error;
            }

            if (error instanceof AuthorizationError) {
                return unauthorized({ error: error.message });
            }
        }
    } else {
        return unauthorized({ fieldErrors });
    }
}

export async function loader({ request }: DataFunctionArgs) {
    await authenticator.isAuthenticated(request, {
        successRedirect: '/timer',
    });

    return null;
}

export default function AuthSignInRoute() {
    const transition = useTransition();
    const actionData = useActionData();

    const busy = transition.state === 'submitting' || transition.state === 'loading';

    // console.log(actionData);

    return (
        <Form method="post">
            <Card shadow="sm" p="md">
                <Box sx={(theme) => ({
                    display: 'flex',
                    alignContent: 'start',
                    gap: theme.spacing.md
                })}>
                    <Button variant="light" color="indigo" disabled>Anmelden</Button>
                    <Button component={Link} to="/auth/sign-up" variant="light" color="indigo">Registrieren</Button>
                </Box>


                <Divider my="md" />

                <Group direction="column" grow>
                    <TextInput
                        autoComplete="username"
                        name="email"
                        label="E-Mail"
                        error={actionData?.fieldErrors?.email}
                    />


                    <PasswordInput
                        autoComplete="current-password"
                        name="password"
                        label="Passwort"
                        error={actionData?.fieldErrors?.password}
                    />

                    <Button type="submit" loading={busy}>Anmelden</Button>
                    {actionData?.error && <Alert color="red">{actionData?.error}</Alert>}
                </Group>
            </Card>
        </Form>
    );
}
