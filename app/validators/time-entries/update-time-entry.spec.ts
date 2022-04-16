import { validateUpdateTimeEntry } from '~/validators/time-entries/update-time-entry';

describe('validateUpdateTimeEntry', () => {
    test('Success', async () => {
        const formData = new FormData();

        const start = new Date();
        const end = new Date();

        formData.append('text', 'text');
        formData.append('start', start.toISOString());
        formData.append('end', end.toISOString());
        formData.append('taskId', 'taskId');

        expect(await validateUpdateTimeEntry(formData)).toStrictEqual({
            data: {
                text: 'text',
                taskId: 'taskId',
                start,
                end
            },
            success: true
        });
    });
});
