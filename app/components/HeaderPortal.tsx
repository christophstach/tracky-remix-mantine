import { Portal } from '@mantine/core';
import { PropsWithChildren } from 'react';

export function HeaderPortal(props: PropsWithChildren<{}>) {
    return (
        <Portal target="#header-portal">{props?.children}</Portal>
    );
}
