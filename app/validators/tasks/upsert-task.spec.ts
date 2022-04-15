import { yupLocale } from '~/locales/yup-locale';
import { validateUpsertTask } from '~/validators/tasks/upsert-task';

describe('validateUpsertTask', () => {
    test('Success', async () => {
        const formData = new FormData()

        formData.append('name', 'name');
        formData.append('description', 'description');
        formData.append('projectId', 'projectId');

        expect(await validateUpsertTask(formData)).toStrictEqual({
            data: {
                name: 'name',
                description: 'description',
                projectId: 'projectId',
            },
            success: true
        });
    });

    describe('Failure', () => {
        test('Name required', async () => {
            const formData = new FormData();

            formData.append('description', 'description');
            formData.append('projectId', 'projectId');

            expect(await validateUpsertTask(formData)).toStrictEqual({
                fieldErrors: {
                    name: yupLocale.mixed?.required,
                },
                success: false
            });
        });
    });
});
