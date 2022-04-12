import { Form } from '@remix-run/react';
import { createRef, useEffect } from 'react';

import { ActionFunction, MetaFunction } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';

export const meta: MetaFunction = () => {
    return {
        title: 'NBHS: Abmelden'
    };
};

export const action: ActionFunction = async ({ request }) => {
    return await  authenticator.logout(request, {
        redirectTo: '/'
    });
}


export default function AuthSignOutRoute() {
    const form = createRef<HTMLFormElement>()

    useEffect(() => {
        setTimeout(() => {
            form.current?.submit();
        }, 2000);
    });

    return (
        <Form method="post" ref={form}>
            Sie wurden abgemeldet.
        </Form>
    );
}
