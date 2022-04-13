import { validateSignUp } from '~/validators/auth/sign-up';
import { DeepMockProxy } from 'jest-mock-extended';
import { db } from '~/services/db.server';
import { PrismaClient } from '@prisma/client';
import { yupLocale } from '~/locales/yup-locale';

jest.mock('~/services/db.server');

describe('validateSignUp', () => {
    const dbMock: DeepMockProxy<PrismaClient> = db as any;

    test('Success', async () => {
        const formData = new FormData();

        dbMock.user.count.mockResolvedValue(0);

        formData.append('email', 'abc@dfg.de');
        formData.append('password', 'Password');
        formData.append('passwordConfirmation', 'Password');

        expect(await validateSignUp(formData)).toStrictEqual({
            data: {
                email: 'abc@dfg.de',
                password: 'Password',
                passwordConfirmation: 'Password',
            },
            success: true
        });
    });

    describe('Failure', () => {
        test('E-Mail required', async () => {
            const formData = new FormData();

            dbMock.user.count.mockResolvedValue(0);

            formData.append('password', 'Password');
            formData.append('passwordConfirmation', 'Password');

            expect(await validateSignUp(formData)).toStrictEqual({
                fieldErrors: {
                    email: yupLocale.mixed?.required,
                },
                success: false
            });
        });

        test('E-Mail invalid', async () => {
            const formData = new FormData();

            dbMock.user.count.mockResolvedValue(0);

            formData.append('email', 'ada.de');
            formData.append('password', 'Password');
            formData.append('passwordConfirmation', 'Password');

            expect(await validateSignUp(formData)).toStrictEqual({
                fieldErrors: {
                    email: yupLocale.string?.email,
                },
                success: false
            });
        });

        test('E-Mail does already exist', async () => {
            const formData = new FormData();

            dbMock.user.count.mockResolvedValue(1);

            formData.append('email', 'abc@dfg.de');
            formData.append('password', 'Password');
            formData.append('passwordConfirmation', 'Password');

            expect(await validateSignUp(formData)).toStrictEqual({
                fieldErrors: {
                    email: 'Diese E-Mail-Adresse wurde bereits registriert',
                },
                success: false
            });
        });

        test('Passwords not equal', async () => {
            const formData = new FormData();

            dbMock.user.count.mockResolvedValue(0);

            formData.append('email', 'abc@dfg.de');
            formData.append('password', 'Password');
            formData.append('passwordConfirmation', 'Password2');

            expect(await validateSignUp(formData)).toStrictEqual({
                fieldErrors: {
                    passwordConfirmation: 'Passwörter müssen übereinstimmen',
                },
                success: false
            });
        });
    });
});
