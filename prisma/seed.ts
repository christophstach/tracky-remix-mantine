import { createUsers } from './seeds/users';

async function seed() {
    const users = await createUsers();
}

seed().then(() => {
    console.log('Seeding success!');
}).catch(e => {
    console.log('Error while seeding: ', e);
});
