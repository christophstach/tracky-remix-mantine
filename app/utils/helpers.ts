import { BaseSchema, ValidationError } from 'yup';
import dayjs from 'dayjs';

export function delay(time: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => resolve(), time);
    });
}


export function truncate(str: string, length = 70, appendix = '...') {
    if (str.length > length) {
        return str.slice(0, length) + appendix;
    } else {
        return str;
    }
}


export function formDataToObject<T>(formData: FormData, ...arrayTypes: string[]): T {
    const object: any = {};

    formData.forEach((value, key) => {
        if (arrayTypes.includes(key)) {
            if (!Array.isArray(object[key])) {
                object[key] = [ value ];
            } else {
                object[key].push(value);
            }
        } else {
            object[key] = value;
        }
    });

    return object as T;
}


export async function validateWithSchema<T extends BaseSchema>(values: object, schema: T) {
    try {
        const data = await schema.validate(values, { abortEarly: false, stripUnknown: true })

        return {
            success: true,
            data
        };
    } catch (err) {
        if (err instanceof ValidationError) {
            return {
                success: false,
                fieldErrors: err.inner.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.message };
                    } else {
                        return acc;
                    }
                }, {}) as any
            };
        }

        return {
            success: false,
            fieldErrors: []
        };
    }
}

export function parseIdParam(param: string | undefined) {
    if (param === undefined) {
        return undefined;
    }

    if (param === 'new') {
        return -1;
    } else {
        const id = parseInt(param, 10);

        if (isNaN(id)) {
            return undefined;
        }

        if (id > 0) {
            return id;
        }

        return undefined;
    }
}

export function toDuration(startDate: Date, endDate: Date) {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const diff = end.diff(start);

    return dayjs.duration(diff);
}
