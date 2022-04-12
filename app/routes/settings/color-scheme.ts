import { DataFunctionArgs } from '@remix-run/node';
import { userPreferencesSessionStorage } from '~/services/user-preferences-session.server';
import { redirectBack } from 'remix-utils';

export async function action({ request }: DataFunctionArgs) {
    const formData = await request.formData();
    const colorScheme = formData.get('colorScheme');
    const session = await userPreferencesSessionStorage.getSession(request.headers.get('Cookie'));

    session.set('colorScheme', colorScheme);

    return redirectBack(request, {
        fallback: '/',
        headers: {
            'Set-Cookie': await userPreferencesSessionStorage.commitSession(session)
        }
    });
}
