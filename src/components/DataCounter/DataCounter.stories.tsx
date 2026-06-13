import type { Meta, StoryObj } from '@storybook/react';
import { DataCounter } from './DataCounter';
import type { Column } from './DataCounter';

const meta: Meta<typeof DataCounter> = {
  title: 'Components/DataCounter',
  component: DataCounter,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Displays a structured grid of labelled data fields. Supports string, number, date, enum, and boolean column types with optional header, badge, and action slot.',
      },
    },
  },
  argTypes: {
    gridColumns: { control: { type: 'number', min: 1, max: 6 } },
    onIconClick: { action: 'icon-click' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataCounter>;

// ── Shared data ──────────────────────────────────────────────────────────────

const baseStructure: Column[] = [
  { label: 'First name', value: 'Jane', type: 'string' },
  { label: 'Last name', value: 'Doe', type: 'string' },
  { label: 'Age', value: 32, type: 'number' },
  { label: 'Email', value: 'jane.doe@example.com', type: 'string' },
  { label: 'Joined', value: '2022-04-15', type: 'date' },
  { label: 'Notes', value: null, type: 'string' },
];

// ── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    title: 'User details',
    structure: baseStructure,
    gridColumns: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    title: 'User details',
    structure: baseStructure,
    gridColumns: 2,
  },
};

export const NoTitle: Story = {
  args: {
    structure: baseStructure,
    gridColumns: 3,
  },
};

export const WithBadge: Story = {
  args: {
    title: 'Account status',
    badge: { value: 'Suspended', type: 'error' },
    structure: baseStructure,
    gridColumns: 3,
  },
};

export const WithSuccessBadge: Story = {
  args: {
    title: 'Account status',
    badge: { value: 'Active', type: 'success' },
    structure: baseStructure,
    gridColumns: 3,
  },
};

export const WithActions: Story = {
  args: {
    title: 'User details',
    structure: baseStructure,
    gridColumns: 3,
    actions: (
      <button
        style={{
          fontSize: '0.75rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '0.375rem',
          border: '1px solid #e5e7eb',
          cursor: 'pointer',
          background: 'white',
        }}
      >
        Edit
      </button>
    ),
  },
};

export const EnumColumn: Story = {
  args: {
    title: 'Order info',
    structure: [
      { label: 'Order ID', value: '#10042', type: 'string' },
      { label: 'Customer', value: 'John Smith', type: 'string' },
      {
        label: 'Status',
        value: 2,
        type: 'enum',
        enumStates: [
          { value: 1, label: 'Pending', color: 'warn' },
          { value: 2, label: 'Shipped', color: 'info' },
          { value: 3, label: 'Delivered', color: 'success' },
          { value: 4, label: 'Cancelled', color: 'error' },
        ],
      },
      { label: 'Total', value: '$128.00', type: 'string' },
      { label: 'Placed', value: '2024-11-01', type: 'date' },
      { label: 'Tracking', value: null },
    ],
    gridColumns: 3,
  },
};

export const BooleanColumn: Story = {
  args: {
    title: 'Feature flags',
    structure: [
      {
        label: 'Email verified',
        value: true,
        type: 'boolean',
        states: {
          truthy: { type: 'text', value: 'Verified', color: 'text-green-600' },
          falsy: { type: 'text', value: 'Not verified', color: 'text-red-500' },
        },
      },
      {
        label: '2FA enabled',
        value: false,
        type: 'boolean',
        states: {
          truthy: { type: 'icon', value: 'check-circle', color: 'text-green-600' },
          falsy: { type: 'icon', value: 'x-circle', color: 'text-red-500' },
        },
      },
      {
        label: 'Newsletter',
        value: true,
        type: 'boolean',
        states: {
          truthy: { type: 'text', value: 'Subscribed', color: 'text-green-600' },
          falsy: { type: 'text', value: 'Unsubscribed', color: 'text-red-500' },
        },
      },
    ],
    gridColumns: 3,
  },
};

export const WithIconOnLabel: Story = {
  args: {
    title: 'Contact info',
    structure: [
      {
        label: 'Phone',
        value: '+1 555 0100',
        type: 'string',
        icon: 'copy',
        iconColor: '#6366f1',
      },
      {
        label: 'Email',
        value: 'jane@example.com',
        type: 'string',
        icon: 'copy',
        iconColor: '#6366f1',
      },
      { label: 'Country', value: 'United States', type: 'string' },
    ],
    gridColumns: 3,
    onIconClick: (item) => alert(`Copied: ${item.value}`),
  },
};

export const EmptyStructure: Story = {
  args: {
    title: 'Empty state',
    structure: [],
    gridColumns: 3,
  },
};

export const AllEmptyValues: Story = {
  args: {
    title: 'Missing data',
    structure: [
      { label: 'Field A', value: null },
      { label: 'Field B', value: '' },
      { label: 'Field C', value: null },
    ],
    gridColumns: 3,
  },
};