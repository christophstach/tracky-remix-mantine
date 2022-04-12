import { Form, Link, useActionData, useTransition } from '@remix-run/react';

import { Alert, Box, Button, Card, Divider, Group, PasswordInput, TextInput } from '@mantine/core';
import { DataFunctionArgs, MetaFunction, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { validateSignUp } from '~/validators/auth/sign-up';
import * as bcrypt from 'bcryptjs';
import { db } from '~/services/db.server';
import { exclude } from '~/utils/exclude';

export const meta: MetaFunction = () => {
    return {
        title: 'Tracky: Registrieren'
    };
};

export async function action({ request }: DataFunctionArgs) {
    const { success, data, fieldErrors } = await validateSignUp(await request.formData());

    if (success && data) {
        const passwordHash = await bcrypt.hash(
            data.password,
            parseInt(process.env.BCRYPT_SALT_ROUNDS as string, 10)
        );

        await db.user.create({
            data: {
                ...exclude(data, 'passwordConfirmation', 'password'),
                passwordHash
            }
        });

        return redirect('/auth/sign-in');
    } else {
        return { fieldErrors };
    }
}

export async function loader({ request, params }: DataFunctionArgs) {
    await authenticator.isAuthenticated(request, {
        successRedirect: '/',
    });

    return null;
}

export default function AuthSignUpRoute() {
    const transition = useTransition();
    const actionData = useActionData();

    const busy = transition.state === 'submitting' || transition.state === 'loading';

    return (
        <Form method="post">
            <Card shadow="sm" p="md">
                <Box sx={(theme) => ({
                    display: 'flex',
                    alignContent: 'start',
                    gap: theme.spacing.md
                })}>
                    <Button component={Link} to="/auth/sign-in" variant="light" color="indigo">Anmelden</Button>
                    <Button variant="light" color="indigo" disabled>Registrieren</Button>
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

                    <PasswordInput
                        autoComplete="new-password"
                        name="passwordConfirmation"
                        label="Passwort bestätigen"
                        error={actionData?.fieldErrors?.passwordConfirmation}
                    />

                    <Button type="submit" loading={busy}>Registrieren</Button>
                    {actionData?.error && <Alert color="red">{actionData?.error}</Alert>}
                </Group>
            </Card>
        </Form>
    );
}
