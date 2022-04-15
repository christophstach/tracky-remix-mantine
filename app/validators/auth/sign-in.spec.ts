import { validateSignIn } from '~/validators/auth/sign-in';

describe('validateSignIn', () => {
    test('Success', async () => {
        const formData = new FormData();

        formData.append('email', 'abc@dfg.de');
        formData.append('password', 'password');

        expect(await validateSignIn(formData)).toStrictEqual({
            data: {
                email: 'abc@dfg.de',
                password: 'password',
            },
            success: true
        });
    });
});
