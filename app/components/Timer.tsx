import { toDuration } from '~/utils/helpers';
import { useContext, useEffect, useState } from 'react';
import { SyncedTimerContext } from '~/contexts/synced-timer';
import { ClientOnly } from 'remix-utils';

interface TimerProps {
    start: Date | null | undefined;
    end: Date | null | undefined;
}

export default function Timer(props: TimerProps) {
    const defaultTime = '00:00:00';
    const format = 'HH:mm:ss';
    const syncedTimer = useContext(SyncedTimerContext);
    const [ time, setTime ] = useState<string | null>(defaultTime);

    useEffect(() => {
        const subscription = syncedTimer.subscribe(() => {
            if (props.start) {
                setTime(toDuration(props.start, new Date()).format(format));
            }
        });

        syncedTimer.trigger();

        return () => {
            subscription.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.start ]);


    return (
        <ClientOnly fallback={defaultTime}>
            {() => time}
        </ClientOnly>
    );
}
