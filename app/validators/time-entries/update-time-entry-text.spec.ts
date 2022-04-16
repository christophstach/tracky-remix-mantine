import { validateUpdateTimeEntryText } from '~/validators/time-entries/update-time-entry-text';

describe('validateUpdateTimeEntryText', () => {
    test('Success', async () => {
        const formData = new FormData()

        formData.append('text', 'text');
        formData.append('id', 'id');

        expect(await validateUpdateTimeEntryText(formData)).toStrictEqual({
            data: {
                text: 'text',
                id: 'id'
            },
            success: true
        });
    });
});
