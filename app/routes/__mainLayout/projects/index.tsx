import { ActionIcon, Box, Card, Group } from '@mantine/core';
import { Link, useCatch, useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useMemo } from 'react';
import type { Column } from 'react-table';
import { useNotifications } from '@mantine/notifications';
import { truncate } from '~/utils/helpers';
import { db } from '~/services/db.server';
import DataGrid from '../../../components/DataGrid';
import { IconPencil, IconTrash } from '@tabler/icons';
import type { DataFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { forbidden } from 'remix-utils';
import TopActions from '~/components/TopActions';


export const handle = {
    breadcrumbs: () => {
        return [
            { to: '/projects', label: 'Projekte' }
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

            navigate('/projects');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

export async function loader({ request }: DataFunctionArgs) {
    const userId = await authenticator.isAuthenticated(request);

    if (!userId) {
        throw forbidden('Not allowed');
    }

    const projects = await db.project.findMany({
        where: {
            userId
        },
        orderBy: {
            name: 'asc'
        },
        include: {
            _count: true,
            client: true
        }
    });

    return { projects };
}

export default function () {
    const loaderData = useLoaderData<InferDataFunction<typeof loader>>();
    const data = useMemo<typeof loaderData.projects>(() => loaderData.projects, [ loaderData.projects ]);

    const columns = useMemo<Column<UnArray<typeof loaderData.projects>>[]>(() => [
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
            Header: 'Klient',
            accessor: 'client',
            Cell: (instance) => {
                return instance.value?.name || '';
            }
        },
        {
            Header: 'Tätigkeiten',
            accessor: '_count',
            disableSortBy: true,
            Cell: (instance) => {
                return instance.value?.tasks || '';
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
                        <ActionIcon component={Link} to={`/projects/${value}`} color="blue" variant="light">
                            <IconPencil />
                        </ActionIcon>

                        <fetcher.Form action={`/projects/${value}`} method="delete">
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
        <>
            <TopActions addLink="/projects/new" />

            <Card shadow="sm" p="md">
                <DataGrid columns={columns} data={data} emptyText="Noch keine Projekte angelegt" />
            </Card>
        </>
    );
}
