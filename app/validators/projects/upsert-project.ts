import { object, string } from 'yup';
import { formDataToObject, validateWithSchema } from '~/utils/helpers';

export async function validateUpsertProject(formData: FormData) {
    const schema = object({
        name: string().required(),
        description: string().default(''),
        clientId: string().nullable().required(),
    });

    return validateWithSchema(
        formDataToObject(
            formData
        ),
        schema
    );
}

