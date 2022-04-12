import { db } from '~/services/db.server';

import * as bcrypt from 'bcryptjs';

export async function createUsers() {
    const admin = await db.user.create({
        data: {
            email: 'admin@tracky.christophstach.me',
            passwordHash: await bcrypt.hash(
                process.env.SEED_USER_DEFAULT_PASSWORD as string,
                parseInt(process.env.BCRYPT_SALT_ROUNDS as string)
            ),
            firstName: 'Christoph',
            lastName: 'Stach',
        }
    });
}
