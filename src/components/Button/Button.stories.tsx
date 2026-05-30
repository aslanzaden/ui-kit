import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import './Button.css';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['main', 'main-danger', 'secondary', 'text', 'url', 'danger'],
    },
    leftIcon: {
      control: 'select',
      options: [undefined, 'ArrowRight'],
    },
    rightIcon: {
      control: 'select',
      options: [undefined, 'ArrowRight'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    autoResize: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Main: Story = {
  args: {
    mode: 'main',
    children: 'Continue',
  },
};

export const Secondary: Story = {
  args: {
    mode: 'secondary',
    children: 'Cancel',
  },
};

export const Danger: Story = {
  args: {
    mode: 'danger',
    children: 'Delete',
  },
};

export const Text: Story = {
  args: {
    mode: 'text',
    children: 'Learn more',
  },
};

export const Url: Story = {
  args: {
    mode: 'url',
    children: 'View details',
  },
};

export const WithLeftIcon: Story = {
  args: {
    mode: 'main',
    children: 'Go',
    leftIcon: 'ArrowRight',
  },
};

export const WithRightIcon: Story = {
  args: {
    mode: 'main',
    children: 'Next',
    rightIcon: 'ArrowRight',
  },
};

export const Loading: Story = {
  args: {
    mode: 'main',
    children: 'Saving...',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    mode: 'main',
    children: 'Submit',
    disabled: true,
  },
};

export const AllModes: Story = {
  name: 'All modes',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {(['main', 'main-danger', 'secondary', 'text', 'url', 'danger'] as const).map((mode) => (
        <Button key={mode} mode={mode}>
          {mode}
        </Button>
      ))}
    </div>
  ),
};