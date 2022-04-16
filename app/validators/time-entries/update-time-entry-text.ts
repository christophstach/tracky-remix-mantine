import { object, string } from 'yup';
import { formDataToObject, validateWithSchema } from '~/utils/helpers';

export async function validateUpdateTimeEntryText(formData: FormData) {
    const schema = object({
        id: string().required(),
        text: string().default(''),
    })

    return validateWithSchema(
        formDataToObject(
            formData
        ),
        schema
    );
}

