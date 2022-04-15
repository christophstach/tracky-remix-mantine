import { yupLocale } from '~/locales/yup-locale';
import { validateUpsertProject } from '~/validators/projects/upsert-project';

describe('validateUpsertProject', () => {
    test('Success', async () => {
        const formData = new FormData()

        formData.append('name', 'name');
        formData.append('description', 'description');
        formData.append('clientId', 'clientId');

        expect(await validateUpsertProject(formData)).toStrictEqual({
            data: {
                name: 'name',
                description: 'description',
                clientId: 'clientId',
            },
            success: true
        });
    });

    describe('Failure', () => {
        test('Name required', async () => {
            const formData = new FormData();

            formData.append('description', 'description');
            formData.append('clientId', 'clientId');

            expect(await validateUpsertProject(formData)).toStrictEqual({
                fieldErrors: {
                    name: yupLocale.mixed?.required,
                },
                success: false
            });
        });
    });
});
