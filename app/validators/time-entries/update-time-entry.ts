import { date, object, ref, string } from 'yup';
import { formDataToObject, validateWithSchema } from '~/utils/helpers';

export async function validateUpdateTimeEntry(formData: FormData) {
    const schema = object({
        text: string().default(''),
        start: date().required(),
        end: date().min(ref('start'), 'Muss nach dem Start liegen').required(),
        taskId: string().nullable()
    }).transform((value) => {
        return {
            ...value,
            taskId: value.taskId ? value.taskId : null
        };
    });

    return validateWithSchema(
        formDataToObject(
            formData
        ),
        schema
    );
}

