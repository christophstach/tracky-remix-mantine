import { ActionIcon, Box, Card, Group } from '@mantine/core';
import { Link, useCatch, useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useMemo } from 'react';
import type { Column } from 'react-table';
import { useNotifications } from '@mantine/notifications';
import { truncate } from '~/utils/helpers';
import { db } from '~/services/db.server';
import DataGrid from '../../../components/DataGrid';
import { IconPencil, IconTrash } from '@tabler/icons';
import TopActions from '~/components/TopActions';
import { DataFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { forbidden } from 'remix-utils';


export const handle = {
    breadcrumbs: () => {
        return [
            { to: '/activities', label: 'Tätigkeiten' }
        ];
    }
}

export function CatchBoundary() {
    const caught = useCatch();
    const navigate = useNavigate();
    const notifications = useNotifications();

    useEffect(() => {
        if (caught.status === 500) {
            notifications.showNotification({
                title: 'Error',
                message: caught.statusText,
                color: 'red'
            });

            navigate('/areas');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

export async function loader({ request }: DataFunctionArgs) {
    const user = await authenticator.isAuthenticated(request);

    if (!user) {
        throw forbidden('Not allowed');
    }

    const activities = await db.activity.findMany({
        where: {
            project: {
                client: {
                    userId: user.id
                }
            }
        },
        orderBy: {
            name: 'asc'
        },
        include: {
            _count: true,
            project: {
                include: {
                    client: true
                }
            }
        }
    });

    return { activities };
}

export default function ActivitiesIndex() {
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();
    const data = useMemo<typeof loaderData.activities>(() => loaderData.activities, [ loaderData.activities ]);

    const columns = useMemo<Column<UnArray<typeof loaderData.activities>>[]>(() => [
        {
            Header: 'Name',
            accessor: 'name',
            width: '25%',
            Cell: (instance) => {
                return <Box sx={{ whiteSpace: 'nowrap' }}>{instance.value}</Box>;
            }
        },
        {
            Header: 'Beschreibung',
            accessor: 'description',
            width: '25%',
            Cell: (instance) => {
                return truncate(instance.value ? instance.value : '');
            }
        },
        {
            Header: 'Projekt',
            accessor: 'project',
            width: '25%',
            Cell: (instance) => {
                return instance.value.name;
            }
        },
        {
            id: 'client',
            Header: 'Klient',
            accessor: 'project',
            width: '25%',
            Cell: (instance) => {
                return instance.value.client.name;
            }
        },
        {
            accessor: 'id',
            disableSortBy: true,
            Cell: (instance) => {
                const fetcher = useFetcher();
                const { state } = fetcher;
                const value = instance.value;

                return (
                    <Group spacing="xs" noWrap>
                        <ActionIcon component={Link} to={`/activities/${value}`} color="blue" variant="light">
                            <IconPencil />
                        </ActionIcon>

                        <fetcher.Form action={`/activities/${value}`} method="delete">
                            <ActionIcon
                                component="button"
                                type="submit"
                                color="red"
                                variant="light"
                                loading={state === 'submitting'}>
                                <IconTrash />
                            </ActionIcon>
                        </fetcher.Form>
                    </Group>
                );
            }
        }
    ], []);

    return (
        <Card shadow="sm" p="md">
            <DataGrid columns={columns} data={data} />

            <TopActions addLink="/activities/new" />
        </Card>
    );
}
