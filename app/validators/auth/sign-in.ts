import { formDataToObject, validateWithSchema } from '~/utils/helpers';
import { object, string } from 'yup';

export async function validateSignIn(formData: FormData) {
    const schema = object({
        email: string().required(),
        password: string().required(),
    })

    return validateWithSchema(
        formDataToObject(
            formData
        ),
        schema
    );
}

