import { formDataToObject, validateWithSchema } from '~/utils/helpers';
import { object, ref, string } from 'yup';
import { db } from '~/services/db.server';

export async function validateSignUp(formData: FormData) {
    const schema = object({
        email: string()
            .email()
            .test(
                'email-exists',
                'Diese E-Mail-Adresse ist bereits vergeben',
                async (value) => {
                    const count = await db.user.count({
                        where: {
                            email: value
                        }
                    });

                    return count === 0;
                }
            )
            .required(),
        password: string().required(),
        passwordConfirmation: string().oneOf([ ref('password'), null ], 'Passwörter müssen übereinstimmen'),
    });

    return validateWithSchema(
        formDataToObject(
            formData
        ),
        schema
    );
}

