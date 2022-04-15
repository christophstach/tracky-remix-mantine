import { yupLocale } from '~/locales/yup-locale';
import { validateTimer } from '~/validators/time-entries/timer';


describe('validateTimer', () => {
    test('Success', async () => {
        const formData = new FormData()

        formData.append('operation', 'start');
        formData.append('taskId', 'taskId');

        expect(await validateTimer(formData)).toStrictEqual({
            data: {
                operation: 'start',
                taskId: 'taskId',
            },
            success: true
        });
    });

    describe('Failure', () => {
        test('Operation required', async () => {
            const formData = new FormData();

            formData.append('taskId', 'taskId');

            expect(await validateTimer(formData)).toStrictEqual({
                fieldErrors: {
                    operation: yupLocale.mixed?.required,
                },
                success: false
            });
        });

        test('Wrong operation', async () => {
            const formData = new FormData();

            formData.append('operation', 'that\'s wrong');
            formData.append('taskId', 'taskId');

            expect(await validateTimer(formData)).toStrictEqual({
                fieldErrors: {
                    operation: yupLocale.mixed?.oneOf,
                },
                success: false
            });
        });
    });
});
