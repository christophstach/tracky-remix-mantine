import { useContext, useEffect, useState } from 'react';
import { toDuration } from '~/utils/helpers';
import type { Duration } from 'dayjs/plugin/duration';
import { SyncedTimerContext } from '~/contexts/synced-timer';
import { ClientOnly } from 'remix-utils';

interface StartEndDuration {
    start: Date;
    end: Date | null | undefined;
}

interface CumulatedTimerProps {
    durations: StartEndDuration[];
}

export default function CumulatedTimer(props: CumulatedTimerProps) {
    const defaultTime = '00:00:00';
    const format = 'HH:mm:ss';
    const syncedTimer = useContext(SyncedTimerContext);
    const [ time, setTime ] = useState<string | null>(
        props.durations.length > 0 ? toTotalDuration(props.durations).format(format) : defaultTime
    );

    function toTotalDuration(startEndDurations: StartEndDuration[]): Duration {
        const durations = startEndDurations.map((duration) => {
            if (duration.end) {
                return toDuration(duration.start, duration.end);
            } else {
                return toDuration(duration.start, new Date());
            }
        });

        return durations.reduce((acc, curr) => acc.add(curr));
    }

    useEffect(() => {
        const subscription = syncedTimer.subscribe(() => {
            if (props.durations.length === 0) {
                setTime(defaultTime);
            } else {
                setTime(toTotalDuration(props.durations).format(format));
            }
        });

        syncedTimer.trigger();

        return () => {
            subscription.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.durations ]);


    return (
        <ClientOnly fallback={defaultTime}>
            {() => time}
        </ClientOnly>
    );
}
