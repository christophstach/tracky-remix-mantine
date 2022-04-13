import { LocaleObject } from 'yup/lib/locale';

export const yupLocale: LocaleObject = {
    string: {
        email: 'Muss eine gültige E-Mail-Adresse sein',

    },
    mixed: {
        required: 'Das ist ein Pflichtfeld',
        oneOf: 'Ungültiger Wert',
    },
}
