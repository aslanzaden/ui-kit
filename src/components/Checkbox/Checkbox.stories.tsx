import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A controlled checkbox component with label support, disabled state, and required validation.',
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the checkbox and label interaction',
    },
    required: {
      control: 'boolean',
      description: 'Marks the checkbox as required',
    },
    title: {
      control: 'text',
      description: 'Tooltip title on the input element',
    },
    name: {
      control: 'text',
      description: 'HTML name attribute for the input',
    },
    onChange: { action: 'changed' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Default unchecked
export const Default: Story = {
  args: {
    checked: false,
    children: 'Accept terms and conditions',
  },
};

// Checked state
export const Checked: Story = {
  args: {
    checked: true,
    children: 'I agree to the privacy policy',
  },
};

// Disabled unchecked
export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    children: 'This option is unavailable',
  },
};

// Disabled checked
export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    children: 'This option is locked on',
  },
};

// Required
export const Required: Story = {
  args: {
    checked: false,
    required: true,
    children: 'You must accept before continuing',
  },
};

// With tooltip title
export const WithTitle: Story = {
  args: {
    checked: false,
    title: 'Hover me for a tooltip',
    children: 'Subscribe to newsletter',
  },
};

// Interactive controlled example
export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Checkbox {...args} checked={checked} onChange={setChecked}>
          {checked ? '✅ Subscribed' : 'Subscribe to updates'}
        </Checkbox>
        <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
          State: <strong>{checked ? 'checked' : 'unchecked'}</strong>
        </p>
      </div>
    );
  },
  args: {
    name: 'subscribe',
  },
};

// Group of checkboxes
export const CheckboxGroup: Story = {
  render: () => {
    const [selections, setSelections] = useState({
      email: true,
      sms: false,
      push: false,
    });

    const toggle = (key: keyof typeof selections) =>
      setSelections((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
      <fieldset style={{ border: 'none', padding: 0 }}>
        <legend style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
          Notification preferences
        </legend>
        <Checkbox checked={selections.email} onChange={() => toggle('email')} name="email">
          Email notifications
        </Checkbox>
        <Checkbox checked={selections.sms} onChange={() => toggle('sms')} name="phone">
          SMS notifications
        </Checkbox>
        <Checkbox checked={selections.push} onChange={() => toggle('push')} name="username">
          Push notifications
        </Checkbox>
      </fieldset>
    );
  },
};