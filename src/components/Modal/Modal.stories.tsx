import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';
import type { ModalButton, ModalProps } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible modal dialog. Pass any content as `children` — dropdowns, forms, text, whatever. The footer buttons are configurable, or replace the entire footer via the `footer` prop.',
      },
    },
  },
  argTypes: {
    open: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    confirmDisabled: { control: 'boolean' },
    onClose: { action: 'closed' },
    onButtonClick: { action: 'button-clicked' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

// ── Trigger wrapper (keeps open state local) ──────────────────────────────────
type WithTriggerProps = Omit<ModalProps, 'open' | 'onClose'> & {
  label?: string;
  open?: boolean;
  onClose?: () => void;
};

const WithTrigger = ({ label = 'Open modal', open: _open, onClose: _onClose, ...props }: WithTriggerProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '0.5rem 1.25rem',
          borderRadius: '0.375rem',
          background: '#6366f1',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.875rem',
        }}
      >
        {label}
      </button>
      <Modal {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

// ── Stories ───────────────────────────────────────────────────────────────────

/** Basic text content */
export const Default: Story = {
  render: () => (
    <WithTrigger
      label="Open modal"
      labels={{ title: 'Confirm action', subtitle: 'This cannot be undone.' }}
      onButtonClick={(action: string) => alert(`Action: ${action}`)}
    >
      <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
        Are you sure you want to proceed? This action is permanent.
      </p>
    </WithTrigger>
  ),
};

/** Modal with a simple select (mimics the original Dropdown use-case) */
export const WithSelect: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <WithTrigger
        label="Open with select"
        labels={{ title: 'Assign to team', subtitle: 'Choose a team member.' }}
        confirmDisabled={!value}
        onButtonClick={(action: string) => {
          if (action === 'confirm') alert(`Confirmed: ${value}`);
        }}
      >
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
          Team member
        </label>
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #e5e7eb',
            fontSize: '0.875rem',
          }}
        >
          <option value="">Select…</option>
          <option value="alice">Alice</option>
          <option value="bob">Bob</option>
          <option value="charlie">Charlie</option>
        </select>
      </WithTrigger>
    );
  },
};

/** Modal with a form */
export const WithForm: Story = {
  render: () => (
    <WithTrigger
      label="Open form modal"
      labels={{ title: 'Add new member' }}
      onButtonClick={(action: string) => alert(`Action: ${action}`)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {['Full name', 'Email'].map((field) => (
          <div key={field}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>
              {field}
            </label>
            <input
              type={field === 'Email' ? 'email' : 'text'}
              placeholder={field}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}
      </div>
    </WithTrigger>
  ),
};

/** Danger variant */
export const DangerConfirm: Story = {
  render: () => (
    <WithTrigger
      label="Delete item"
      labels={{
        title: 'Delete record',
        subtitle: 'This will permanently remove the record and all associated data.',
      }}
      buttons={[
        { label: 'Cancel', action: 'cancel' },
        { label: 'Delete', mode: 'main-danger', action: 'confirm' },
      ]}
      onButtonClick={(action: string) => alert(`Action: ${action}`)}
    >
      <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
        Record <strong>#10042</strong> will be deleted. This cannot be undone.
      </p>
    </WithTrigger>
  ),
};

/** Loading state */
export const Loading: Story = {
  render: () => (
    <WithTrigger
      label="Open loading modal"
      labels={{ title: 'Saving changes…' }}
      isLoading
      onButtonClick={(action: string) => alert(`Action: ${action}`)}
    >
      <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
        Please wait while we save your changes.
      </p>
    </WithTrigger>
  ),
};

/** Custom footer */
export const CustomFooter: Story = {
  render: () => (
    <WithTrigger
      label="Custom footer"
      labels={{ title: 'Custom actions' }}
      footer={
        <footer style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
          <button
            style={{
              padding: '0.5rem 2rem',
              background: '#22c55e',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            onClick={() => alert('Custom action!')}
          >
            Do something custom
          </button>
        </footer>
      }
    >
      <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
        This modal has a fully custom footer passed via the <code>footer</code> prop.
      </p>
    </WithTrigger>
  ),
};

/** No header */
export const NoHeader: Story = {
  render: () => (
    <WithTrigger
      label="Open headerless modal"
      onButtonClick={(action: string) => alert(`Action: ${action}`)}
    >
      <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
        This modal has no title or subtitle — the header is omitted entirely.
      </p>
    </WithTrigger>
  ),
};

/** Custom button set */
export const CustomButtons: Story = {
  render: () => {
    const buttons: ModalButton[] = [
      { label: 'Skip', action: 'skip', mode: 'text' },
      { label: 'Save draft', action: 'draft', mode: 'secondary' },
      { label: 'Publish', action: 'confirm', mode: 'main' },
    ];
    return (
      <WithTrigger
        label="Multi-action modal"
        labels={{ title: 'Publish article' }}
        buttons={buttons}
        onButtonClick={(action: string) => alert(`Action: ${action}`)}
      >
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
          Ready to go live? You can also save a draft or skip for now.
        </p>
      </WithTrigger>
    );
  },
};