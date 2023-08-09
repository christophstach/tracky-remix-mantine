import { createUsers } from './seeds/users';
import { createClients } from './seeds/clients';
import { createProjects } from './seeds/projects';
import { createTasks } from './seeds/tasks';

async function seed() {
    const users = await createUsers();
    const clients = await createClients(users);
    const projects = await createProjects(users, clients);
    await createTasks(users, projects);
}

seed().then(() => {
    console.log('Seeding success!');
}).catch(e => {
    console.log('Error while seeding: ', e);
});
