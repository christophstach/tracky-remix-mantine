import { yupLocale } from '~/locales/yup-locale';
import { validateUpsertProject } from '~/validators/projects/upsert-project';
import { validateTimer } from '~/validators/time-tracks/timer';

describe('validateTimer', () => {
    test('Success', async () => {
        const formData = new FormData()

        formData.append('operation', 'start');
        formData.append('activityId', 'ActivityId');

        expect(await validateTimer(formData)).toStrictEqual({
            data: {
                operation: 'start',
                activityId: 'ActivityId',
            },
            success: true
        });
    });

    describe('Failure', () => {
        test('ActivityId required', async () => {
            const formData = new FormData();

            formData.append('operation', 'stop');

            expect(await validateTimer(formData)).toStrictEqual({
                fieldErrors: {
                    activityId: yupLocale.mixed?.required,
                },
                success: false
            });
        });

        test('Operation required', async () => {
            const formData = new FormData();

            formData.append('activityId', 'ActivityId');

            expect(await validateTimer(formData)).toStrictEqual({
                fieldErrors: {
                    operation: yupLocale.mixed?.required,
                },
                success: false
            });
        });

        test('Wrong operation', async () => {
            const formData = new FormData();

            formData.append('operation', 'thats wrong');
            formData.append('activityId', 'ActivityId');

            expect(await validateTimer(formData)).toStrictEqual({
                fieldErrors: {
                    operation: yupLocale.mixed?.oneOf,
                },
                success: false
            });
        });
    });
});
