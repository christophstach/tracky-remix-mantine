import { date, object } from 'yup';
import { formDataToObject, validateWithSchema } from '~/utils/helpers';

export async function validateStartTimer(formData: FormData) {
    const schema = object({
        start: date().required()
    });

    return validateWithSchema(
        formDataToObject(
            formData
        ),
        schema
    );
}

