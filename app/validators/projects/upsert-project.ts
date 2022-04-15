import { object, string } from 'yup';
import { formDataToObject, validateWithSchema } from '~/utils/helpers';

export async function validateUpsertProject(formData: FormData) {
    const schema = object({
        name: string().required(),
        description: string().default(''),
        clientId: string().nullable(),
    }).transform((value) => {
        return {
            ...value,
            clientId: value.clientId ? value.clientId : null
        };
    });

    return validateWithSchema(
        formDataToObject(
            formData
        ),
        schema
    );
}

