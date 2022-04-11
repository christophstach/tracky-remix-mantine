import { validateUpsertArea } from '~/validators/areas/upsert-area';

describe('validateUpsertArea', () => {
    test('Success', async () => {
        const formData = new FormData()

        formData.append('name', 'Name');
        formData.append('description', 'Description');
        formData.append('managers', '1,2,3');
        formData.append('projects', '1,2,3');

        expect(await validateUpsertArea(formData)).toStrictEqual({
            data: {
                name: 'Name',
                description: 'Description',
                comment: '',
                managers: [ 1, 2, 3 ],
                projects: [ 1, 2, 3 ]
            },
            success: true
        });
    });

    describe('Failure', () => {
        test('Name required', async () => {
            const formData = new FormData();

            formData.append('description', 'Description');
            formData.append('managers', '1');
            formData.append('projects', '1');

            expect(await validateUpsertArea(formData)).toStrictEqual({
                fieldErrors: {
                    name: 'Name ist ein Pflichtfeld',
                },
                success: false
            });
        });
    });
});
