import { db } from '~/services/db.server';
import type { createUsers } from './users';
import type { createProjects } from './projects';

export async function createTasks(
    users: Awaited<ReturnType<typeof createUsers>>,
    projects: Awaited<ReturnType<typeof createProjects>>
) {
    const entwicklung = await db.task.create({
        data: {
            name: 'Entwicklung',
            description: '',
            userId: users.admin.id,
            projectId: projects.tracky.id
        }
    });

    return { entwicklung };
}
