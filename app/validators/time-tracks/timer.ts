import { object, string } from 'yup';
import { formDataToObject, validateWithSchema } from '~/utils/helpers';

export async function validateTimer(formData: FormData) {
    const schema = object({
        operation: string().oneOf([ 'start', 'stop' ]).required(),
        activityId: string().required(),
    });

    return validateWithSchema(
        formDataToObject(
            formData
        ),
        schema
    );
}

