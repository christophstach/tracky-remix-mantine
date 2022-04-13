import { object, string } from 'yup';
import { formDataToObject, validateWithSchema } from '~/utils/helpers';

export async function validateUpsertClient(formData: FormData) {
    const schema = object({
        name: string().required(),
        description: string().default(''),
    });

    return validateWithSchema(
        formDataToObject(
            formData
        ),
        schema
    );
}

