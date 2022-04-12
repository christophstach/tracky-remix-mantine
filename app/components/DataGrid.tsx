import { Column, TableInstance, useRowState, useSortBy, useTable } from 'react-table';
import { ActionIcon, Box, Group, Table } from '@mantine/core';
import { IconArrowDown, IconArrowUp } from '@tabler/icons';


interface DataGridProps<T extends object> {
    columns: Column<T>[],
    data: T[]
}

export default function DataGrid<T extends object>(props: DataGridProps<T>) {
    const table: TableInstance<T> = useTable<T>({
            columns: props.columns,
            data: props.data,
            autoResetRowState: false,
        },
        useSortBy,
        useRowState
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = table;

    return (
        <Box sx={{ overflowX: 'auto' }}>
            <Table  {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps({
                                ...column.getSortByToggleProps(),
                                style: {
                                    width: column.width,
                                    minWidth: column.minWidth,
                                    maxWidth: column.maxWidth
                                }
                            })}>
                                <Group spacing="xs" noWrap>
                                    <span>{column.render('Header')}</span>
                                    <span>
                                    {
                                        column.isSorted
                                            ? column.isSortedDesc
                                                ? (
                                                    <ActionIcon color="indigo" size="xs" variant="transparent">
                                                        <IconArrowUp />
                                                    </ActionIcon>
                                                )
                                                : (
                                                    <ActionIcon color="indigo" size="xs" variant="transparent">
                                                        <IconArrowDown />
                                                    </ActionIcon>
                                                )
                                            : null
                                    }
                                    </span>
                                </Group>

                            </th>
                        ))}
                    </tr>
                ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row)

                    return (
                        <tr {...row.getRowProps()} hidden={!!row.state.hidden}>
                            {row.cells.map(cell => (
                                <td {...cell.getCellProps({
                                    style: {
                                        width: cell.column.width,
                                        minWidth: cell.column.minWidth,
                                        maxWidth: cell.column.maxWidth,
                                    }
                                })}>
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        </Box>
    );
}
