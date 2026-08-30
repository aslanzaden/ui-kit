import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useRef, useState } from 'react';
import { Dropdown } from './Dropdown';
import type { TypeDropdownOptionItem } from '../../constants/dropdown-component';

const COUNTRY_OPTIONS: TypeDropdownOptionItem[] = [
  { label: 'Azerbaijan', value: 'az' },
  { label: 'Georgia', value: 'ge' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Spain', value: 'es' },
  { label: 'Italy', value: 'it' },
  { label: 'Portugal', value: 'pt' },
  { label: 'Netherlands', value: 'nl' },
];

// A larger dataset to simulate a remote, server-side search endpoint.
const REMOTE_DATASET: TypeDropdownOptionItem[] = Array.from({ length: 200 }, (_, i) => ({
  label: `Contact #${i + 1}`,
  value: i + 1,
}));

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A select/combobox built on Input. Supports single & multi-select, local-first filtering (typing filters the loaded options instantly), a debounced `onSearchQuery` fallback for remote search when the local filter comes up empty, and infinite scroll pagination via `onLoadMore`.',
      },
    },
  },
  argTypes: {
    multiselect: { control: 'boolean' },
    searchable: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
    onSearchQuery: { action: 'search-query' },
    onLoadMore: { action: 'load-more' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ width: '18rem' }}>
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: COUNTRY_OPTIONS,
  },
};

export const Multiselect: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['de', 'fr']);
    return (
      <div style={{ width: '18rem' }}>
        <Dropdown {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Countries',
    placeholder: 'Select countries',
    options: COUNTRY_OPTIONS,
    multiselect: true,
    clearable: true,
  },
};

/**
 * Search is local-first: typing filters whatever `options` are already loaded
 * in memory, instantly and with no network call. `onSearchQuery` only fires
 * (debounced by `searchDebounceMs`) once that local filter comes up empty — so
 * typing "Contact #1" matches instantly against the 20 loaded contacts, while
 * typing "Contact #150" finds nothing locally and falls back to the simulated
 * remote endpoint below.
 */
export const RemoteSearchWithDebounce: Story = {
  name: 'Searchable (local-first, debounced remote fallback)',
  render: (args) => {
    const [value, setValue] = useState<number | null>(null);
    const [options, setOptions] = useState<TypeDropdownOptionItem[]>(REMOTE_DATASET.slice(0, 20));
    const [loading, setLoading] = useState(false);
    const requestId = useRef(0);

    const runSearch = (query: string) => {
      const thisRequest = ++requestId.current;
      setLoading(true);

      // Simulated network latency for a remote "search contacts" endpoint.
      window.setTimeout(() => {
        if (thisRequest !== requestId.current) return; // a newer keystroke already superseded this one

        const matches = query
          ? REMOTE_DATASET.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
          : REMOTE_DATASET.slice(0, 20);

        setOptions(matches);
        setLoading(false);
      }, 400);
    };

    return (
      <div style={{ width: '18rem' }}>
        <Dropdown
          {...args}
          value={value}
          onChange={setValue}
          options={options}
          loading={loading}
          onSearchQuery={runSearch}
        />
      </div>
    );
  },
  args: {
    label: 'Contact',
    placeholder: 'Search contacts...',
    searchable: true,
    searchDebounceMs: 300,
  },
};

export const InfiniteScroll: Story = {
  render: (args) => {
    const PAGE_SIZE = 20;
    const [value, setValue] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const options = useMemo(() => REMOTE_DATASET.slice(0, page * PAGE_SIZE), [page]);
    const hasMore = options.length < REMOTE_DATASET.length;

    const loadMore = () => {
      if (loading || !hasMore) return;
      setLoading(true);
      window.setTimeout(() => {
        setPage((p) => p + 1);
        setLoading(false);
      }, 500);
    };

    return (
      <div style={{ width: '18rem' }}>
        <Dropdown
          {...args}
          value={value}
          onChange={setValue}
          options={options}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </div>
    );
  },
  args: {
    label: 'Contact',
    placeholder: 'Select a contact',
    infiniteScroll: true,
  },
};

export const WithValidationMessage: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ width: '18rem' }}>
        <Dropdown
          {...args}
          value={value}
          onChange={setValue}
          message={
            value ? undefined : { type: 'error', content: 'Please select a country' }
          }
        />
      </div>
    );
  },
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: COUNTRY_OPTIONS,
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Country',
    options: COUNTRY_OPTIONS,
    value: 'de',
    disabled: true,
  },
};
