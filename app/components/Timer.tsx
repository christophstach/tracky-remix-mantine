import { toDuration } from '~/utils/helpers';
import { useEffect, useState } from 'react';
import { useInterval } from '@mantine/hooks';

interface TimerProps {
    start: Date | null | undefined;
    end: Date | null | undefined;
}

export default function Timer(props: TimerProps) {
    const defaultTime = '00:00:00';
    const [ time, setTime ] = useState<string | null>(defaultTime);

    const interval = useInterval(() => {
        if (props.start) {
            setTime(toDuration(props.start, new Date()));
        }
    }, 1000);

    useEffect(() => {
        if (props.start) {
            setTime(toDuration(props.start, new Date()));
            interval.start();
        } else {
            setTime(defaultTime);
            interval.stop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.start ]);

    return (
        <>
            {time}
        </>
    );
}
