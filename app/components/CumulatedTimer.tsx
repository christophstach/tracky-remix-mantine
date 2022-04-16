import { useEffect, useState } from 'react';
import { useInterval } from '@mantine/hooks';
import { toDuration } from '~/utils/helpers';
import type { Duration } from 'dayjs/plugin/duration';

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
    const [ time, setTime ] = useState<string | null>(defaultTime);

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

    const interval = useInterval(() => {
        setTime(toTotalDuration(props.durations).format(format))
    }, 1000);

    useEffect(() => {
        interval.stop();

        if (props.durations.length > 0) {
            const hasRunningDuration = props.durations.some((duration) => duration.end === null);
            setTime(toTotalDuration(props.durations).format(format));

            if (hasRunningDuration) {
                interval.start();

                setTimeout(() => {
                    if (!interval.active) {
                        interval.start();
                    }
                }, 1000);
            }
        } else {
            setTime(defaultTime);
        }

        return () => {
            interval.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.durations ]);

    return <span>{time}</span>;
}
