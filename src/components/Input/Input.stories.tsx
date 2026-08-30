import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A controlled text input with label, left/right icons, password visibility toggle, validation messages, and a link slot next to the label.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'number', 'email', 'search', 'tel', 'date', 'file', 'url'],
    },
    leftIcon: { control: 'select', options: [undefined, 'ArrowRight'] },
    rightIcon: { control: 'select', options: [undefined, 'ArrowRight'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    onChange: { action: 'changed' },
    onValidate: { action: 'validated' },
    onFocusChange: { action: 'focusChanged' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

const ControlledInput = (args: React.ComponentProps<typeof Input>) => {
  const [value, setValue] = useState(args.value ?? '');
  return <Input {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    label: 'Full name',
    placeholder: 'Jane Doe',
    name: 'firstname',
  },
};

export const Required: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'email',
    name: 'email',
    required: true,
  },
};

export const WithIcons: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    label: 'Search',
    placeholder: 'Search anything...',
    leftIcon: 'ArrowRight',
    rightIcon: 'ArrowRight',
    name: 'search',
  },
};

export const Password: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    name: 'password',
  },
};

export const WithUrlLink: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    label: 'Password',
    type: 'password',
    name: 'password',
    url: { to: '#', label: 'Forgot password?' },
  },
};

export const SuccessMessage: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    label: 'Username',
    name: 'username',
    value: 'jane_doe',
    message: { type: 'success', content: 'Username is available' },
  },
};

export const ErrorMessage: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    label: 'Username',
    name: 'username',
    value: 'a',
    message: { type: 'error', content: 'Username must be at least 3 characters' },
  },
};

export const WarnMessage: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    label: 'Password',
    type: 'password',
    name: 'password',
    message: { type: 'warn', content: 'Password strength: weak' },
  },
};

export const InfoMessage: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    label: 'Phone number',
    type: 'tel',
    name: 'phone',
    message: { type: 'info', content: 'Include your country code' },
  },
};

export const Disabled: Story = {
  args: {
    label: 'Account ID',
    name: 'username',
    value: 'usr_1234567890',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Referral code',
    name: 'comment',
    value: 'REF-8837',
    readOnly: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const isValid = value.length >= 3;
    return (
      <div style={{ width: '20rem' }}>
        <Input
          label="Display name"
          name="firstname"
          placeholder="Min. 3 characters"
          value={value}
          onChange={setValue}
          message={
            value.length === 0
              ? undefined
              : isValid
                ? { type: 'success', content: 'Looks good' }
                : { type: 'error', content: 'Too short' }
          }
        />
      </div>
    );
  },
};
