import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { DataTable } from './DataTable';
import type { TableColumn, TableStatusTransition } from '../../constants/table-component';
import { t } from '../../../.storybook/i18n';

type Person = {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  status: 'active' | 'invited' | 'suspended';
  joinedAt: string;
  score: number;
};

const ALL_ROWS: Person[] = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  name: `Person #${i + 1}`,
  email: `person${i + 1}@example.com`,
  role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'Editor' : 'Viewer',
  active: i % 4 !== 0,
  status: i % 5 === 0 ? 'suspended' : i % 3 === 0 ? 'invited' : 'active',
  joinedAt: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
  score: Math.round(Math.random() * 100),
}));

const COLUMNS: TableColumn[] = [
  { key: 'id' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  {
    key: 'role',
    label: 'Role',
    type: 'enum',
    enumStates: [
      { label: 'Admin', value: 'Admin', color: 'destructive' },
      { label: 'Editor', value: 'Editor', color: 'blue' },
      { label: 'Viewer', value: 'Viewer', color: 'gray' },
    ],
  },
  { key: 'active', label: 'Active', type: 'boolean' },
  { key: 'joinedAt', label: 'Joined', type: 'date', sortable: true },
  { key: 'score', label: 'Score', type: 'number', sortable: true, align: 'right' },
];

const STATUS_TRANSITIONS: TableStatusTransition[] = [
  { value: 'activate', label: 'Activate', icon: 'CircleCheck', validFromStatuses: ['invited', 'suspended'] },
  { value: 'suspend', label: 'Suspend', icon: 'CircleMinus', validFromStatuses: ['active', 'invited'] },
];

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A feature-rich data table: sorting, column visibility, single/checkbox/radio selection, inline editable & button cells, bulk status actions, a teleported per-row action menu, search (debounced), and pagination. Client-side sorting only — page slicing is expected to happen server-side via the `page`/`onChangePage` props.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const PER_PAGE = 10;

function useServerLikePagination(rows: Person[], search: string) {
  const filtered = useMemo(
    () => rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );
  return filtered;
}

export const Playground: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(PER_PAGE);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [inputValues, setInputValues] = useState<Record<number, Record<string, string | number>>>({});

    const filtered = useServerLikePagination(ALL_ROWS, search);
    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const pageRows = filtered.slice(currentPage * perPage, currentPage * perPage + perPage);

    return (
      <DataTable
        data={pageRows}
        columns={COLUMNS}
        page={{ current: currentPage, total: totalPages, perPage }}
        statusTransitions={STATUS_TRANSITIONS}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        search={search}
        onSearchItem={setSearch}
        inputValues={inputValues}
        onInputValuesChange={setInputValues}
        onChangePage={({ page, perPage: nextPerPage }) => {
          setCurrentPage(page);
          setPerPage(nextPerPage);
        }}
        actions={[
          { value: 'edit', label: 'Edit', icon: 'Columns3' },
          { value: 'delete', label: 'Delete', icon: 'Close', mode: 'danger' },
        ]}
        onExecuteAction={({ action, rowId }) => alert(`${action} row ${rowId}`)}
        onBulkStatusChange={({ status, rowIds }) => alert(`${status} rows: ${rowIds.join(', ')}`)}
        onAddItem={() => alert('add item')}
        onViewItem={(rowId) => alert(`view row ${rowId}`)}
        t={t}
      />
    );
  },
};

export const WithInlineEditingAndButtonCells: Story = {
  name: 'Input & button cell types',
  render: () => {
    const [inputValues, setInputValues] = useState<Record<number, Record<string, string | number>>>({});
    const rows = ALL_ROWS.slice(0, 8);

    const columns: TableColumn[] = [
      { key: 'id' },
      { key: 'name', label: 'Name' },
      {
        key: 'score',
        label: 'Adjust score',
        type: 'input',
        inputConfig: { inputType: 'number', min: 0, max: 100 },
      },
      {
        key: 'actions',
        label: 'Approve',
        type: 'button',
        buttonConfig: { icon: 'CircleCheck', label: 'Approve' },
      },
    ];

    return (
      <DataTable
        data={rows}
        columns={columns}
        page={{ current: 0, total: 1, perPage: rows.length }}
        tableOptions={{ searchable: false, canAddItems: false, selectionType: 'simple' }}
        inputValues={inputValues}
        onInputValuesChange={setInputValues}
        onCellClick={({ key, row }) => alert(`clicked "${key}" cell for row ${row.id}`)}
        t={t}
      />
    );
  },
};

export const RadioSelection: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<number[]>([3]);
    const rows = ALL_ROWS.slice(0, 6);
    return (
      <DataTable
        data={rows}
        columns={COLUMNS}
        page={{ current: 0, total: 1, perPage: rows.length }}
        tableOptions={{ selectionType: 'radio', searchable: false, canAddItems: false, isActionable: false }}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        t={t}
      />
    );
  },
};

export const ViewOnly: Story = {
  name: 'View-only (no selection, no actions)',
  render: () => {
    const rows = ALL_ROWS.slice(0, 6);
    return (
      <DataTable
        data={rows}
        columns={COLUMNS}
        page={{ current: 0, total: 1, perPage: rows.length }}
        tableOptions={{
          selectionType: 'simple',
          searchable: false,
          canAddItems: false,
          isActionable: false,
          hidePagination: true,
        }}
        t={t}
      />
    );
  },
};

export const EmptyState: Story = {
  args: {
    data: [],
    columns: COLUMNS,
    page: { current: 0, total: 0, perPage: PER_PAGE },
    t,
  },
};
