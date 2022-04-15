import { db } from '~/services/db.server';
import type { createUsers } from './users';

export async function createClients(users: Awaited<ReturnType<typeof createUsers>>) {
    const ich = await db.client.create({
        data: {
            name: 'Ich',
            description: '',
            userId: users.admin.id,
        }
    });

    return { ich };
}
