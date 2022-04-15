import { validateUpsertClient } from '~/validators/clients/upsert-client';
import { yupLocale } from '~/locales/yup-locale';

describe('validateUpsertClient', () => {
    test('Success', async () => {
        const formData = new FormData()

        formData.append('name', 'name');
        formData.append('description', 'description');

        expect(await validateUpsertClient(formData)).toStrictEqual({
            data: {
                name: 'name',
                description: 'description',
            },
            success: true
        });
    });

    describe('Failure', () => {
        test('Name required', async () => {
            const formData = new FormData();

            formData.append('description', 'description');

            expect(await validateUpsertClient(formData)).toStrictEqual({
                fieldErrors: {
                    name: yupLocale.mixed?.required,
                },
                success: false
            });
        });
    });
});
