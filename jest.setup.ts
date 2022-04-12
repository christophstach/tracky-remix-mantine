import { installGlobals } from '@remix-run/node/globals';
import { setLocale } from 'yup';
import { yupLocale } from '~/locales/yup-locale';

installGlobals();

setLocale(yupLocale)
