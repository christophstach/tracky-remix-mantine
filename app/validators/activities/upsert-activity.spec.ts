import { yupLocale } from '~/locales/yup-locale';
import { validateUpsertActivity } from '~/validators/activities/upsert-activity';

describe('validateUpsertActivity', () => {
    test('Success', async () => {
        const formData = new FormData()

        formData.append('name', 'Name');
        formData.append('description', 'Description');
        formData.append('projectId', 'ProjectId');

        expect(await validateUpsertActivity(formData)).toStrictEqual({
            data: {
                name: 'Name',
                description: 'Description',
                projectId: 'ProjectId'
            },
            success: true
        });
    });

    describe('Failure', () => {
        test('Name required', async () => {
            const formData = new FormData();

            formData.append('description', 'Description');
            formData.append('projectId', 'ProjectId');

            expect(await validateUpsertActivity(formData)).toStrictEqual({
                fieldErrors: {
                    name: yupLocale.mixed?.required,
                },
                success: false
            });
        });
    });
});
