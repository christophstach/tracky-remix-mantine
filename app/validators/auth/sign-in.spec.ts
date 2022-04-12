import { validateSignIn } from '~/validators/auth/sign-in';

describe('validateSignIn', () => {
    test('Success', async () => {
        const formData = new FormData();

        formData.append('email', 'E-Mail');
        formData.append('password', 'Password');

        expect(await validateSignIn(formData)).toStrictEqual({
            data: {
                email: 'E-Mail',
                password: 'Password',
            },
            success: true
        });
    });

});
