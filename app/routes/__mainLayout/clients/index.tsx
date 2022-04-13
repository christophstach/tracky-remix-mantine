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


export const handle = {
    breadcrumbs: () => {
        return [
            { to: '/clients', label: 'Klienten' }
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

            navigate('/clients');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

export async function loader() {
    const clients = await db.client.findMany({
        orderBy: {
            name: 'asc'
        },
        include: {
            _count: true
        }
    });

    return { clients };
}

export default function ClientsIndex() {
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();
    const data = useMemo<typeof loaderData.clients>(() => loaderData.clients, [ loaderData.clients ]);

    const columns = useMemo<Column<UnArray<typeof loaderData.clients>>[]>(() => [
        {
            Header: 'Name',
            accessor: 'name',
            Cell: (instance) => {
                return <Box sx={{ whiteSpace: 'nowrap' }}>{instance.value}</Box>;
            }
        },
        {
            Header: 'Beschreibung',
            accessor: 'description',
            width: '100%',
            Cell: (instance) => {
                return truncate(instance.value ? instance.value : '');
            }
        },

        {
            Header: 'Projekte',
            accessor: '_count',
            disableSortBy: true,
            Cell: (instance) => {
                return instance.value.projects;
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
                        <ActionIcon component={Link} to={`/clients/${value}`} color="blue" variant="light">
                            <IconPencil />
                        </ActionIcon>

                        <fetcher.Form action={`/clients/${value}`} method="delete">
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

            <TopActions addLink="/clients/new" />
        </Card>
    );
}
