import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { User } from '@prisma/client'
import { db } from '~/services/db.server';
import * as bcrypt from 'bcryptjs';
import { exclude } from '~/utils/exclude';
import { authSessionStorage } from '~/services/auth-session.server';


export const authenticator = new Authenticator<string>(authSessionStorage);

authenticator.use(
    new FormStrategy(async ({ context }) => {
        const formData = context as FormData;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (email && password) {
            const user = await db.user.findUnique({
                where: {
                    email
                }
            });

            if (user) {
                if (await bcrypt.compare(password, user.passwordHash)) {
                    return user.id;
                }
            }
        }

        throw new AuthorizationError('Anmeldung fehlgeschlagen');
    }),
    'form'
);
