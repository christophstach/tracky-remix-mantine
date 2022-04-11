import { format } from "date-fns"

import { GridValueFormatterParams } from "@mui/x-data-grid";

export function dateTimeValueFormatter(params: GridValueFormatterParams): string {
    const value = params.value as string;

    if (value) {
        return format(new Date(value), 'dd.MM.yyyy HH:mm:ss');
    } else {
        return '';
    }
}
