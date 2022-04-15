import { DeepMockProxy } from 'jest-mock-extended';
import { db } from '~/services/db.server';
import { PrismaClient } from '@prisma/client';
import { validateProfile } from '~/validators/profile/profile';

jest.mock('~/services/db.server');

describe('validateProfile', () => {
    const dbMock: DeepMockProxy<PrismaClient> = db as any;

    test('Success', async () => {
        const formData = new FormData();

        dbMock.user.count.mockResolvedValue(0);

        formData.append('email', 'abc@dfg.de');
        formData.append('firstName', 'firstName');
        formData.append('lastName', 'lastName');

        expect(await validateProfile(formData,  'userId')).toStrictEqual({
            data: {
                email: 'abc@dfg.de',
                firstName: 'firstName',
                lastName: 'lastName',
            },
            success: true
        });
    });
});
