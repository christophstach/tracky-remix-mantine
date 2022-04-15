import { db } from '~/services/db.server';
import type { createUsers } from './users';
import type { createClients } from './clients';

export async function createProjects(
    users: Awaited<ReturnType<typeof createUsers>>,
    clients: Awaited<ReturnType<typeof createClients>>
) {
    const tracky = await db.project.create({
        data: {
            name: 'Tracky',
            description: '',
            userId: users.admin.id,
            clientId: clients.ich.id
        }
    });

    return { tracky };
}
