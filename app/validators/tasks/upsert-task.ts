import { object, string } from 'yup';
import { formDataToObject, validateWithSchema } from '~/utils/helpers';

export async function validateUpsertTask(formData: FormData) {
    const schema = object({
        name: string().required(),
        description: string().default(''),
        projectId: string().nullable().required(),
    });

    return validateWithSchema(
        formDataToObject(
            formData
        ),
        schema
    );
}

