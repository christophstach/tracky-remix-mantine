import { useEffect, useState } from 'react';
import { useInterval } from '@mantine/hooks';
import { toDuration } from '~/utils/helpers';
import { Duration } from 'dayjs/plugin/duration';

interface CumulatedTimerProps {
    durations: {
        start: Date;
        end: Date | null | undefined;
    }[];
}

export default function CumulatedTimer(props: CumulatedTimerProps) {
    const defaultTime = '00:00:00';
    const format = 'HH:mm:ss';
    const [ time, setTime ] = useState<string | null>(defaultTime);

    function toTotalDuration(startEndDurations: {
        start: Date;
        end: Date | null | undefined;
    }[]): Duration {
        const durations = props.durations.map((duration) => {
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
        if (props.durations.length > 0) {
            const hasRunningDuration = props.durations.some((duration) => duration.end === null);
            setTime(toTotalDuration(props.durations).format(format))

            if (hasRunningDuration) {
                interval.start();
            } else {
                interval.stop();
            }
        } else {
            setTime(defaultTime);
            interval.stop();
        }

        return () => {
            interval.stop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.durations ]);

    return (
        <>
            {time}
        </>
    );
}
