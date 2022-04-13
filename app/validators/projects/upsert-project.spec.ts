import { yupLocale } from '~/locales/yup-locale';
import { validateUpsertProject } from '~/validators/projects/upsert-project';

describe('validateUpsertProject', () => {
    test('Success', async () => {
        const formData = new FormData()

        formData.append('name', 'Name');
        formData.append('description', 'Description');
        formData.append('clientId', 'ClientId');

        expect(await validateUpsertProject(formData)).toStrictEqual({
            data: {
                name: 'Name',
                description: 'Description',
                clientId: 'ClientId'
            },
            success: true
        });
    });

    describe('Failure', () => {
        test('Name required', async () => {
            const formData = new FormData();

            formData.append('description', 'Description');
            formData.append('clientId', 'ClientId');

            expect(await validateUpsertProject(formData)).toStrictEqual({
                fieldErrors: {
                    name: yupLocale.mixed?.required,
                },
                success: false
            });
        });
    });
});
