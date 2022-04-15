import { object, string } from 'yup';
import { formDataToObject, validateWithSchema } from '~/utils/helpers';
import { db } from '~/services/db.server';

export async function validateProfile(formData: FormData, userId: string) {
    const schema = object({
        email: string()
            .email()
            .test(
                'email-exists',
                'Diese E-Mail-Adresse ist bereits vergeben',
                async (value) => {
                    const count = await db.user.count({
                        where: {
                            email: value,
                            NOT: { id: userId },
                        }
                    });

                    return count === 0;
                }
            )
            .required(),
        firstName: string().default(''),
        lastName: string().default(''),
    })

    return validateWithSchema(
        formDataToObject(
            formData
        ),
        schema
    );
}

