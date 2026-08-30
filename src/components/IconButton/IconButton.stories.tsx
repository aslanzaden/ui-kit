import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A square, icon-only button in three sizes. Pass `iconName` for the default icon, or override with children for any custom content.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    iconName: { control: 'select', options: ['ArrowRight', 'Close', 'ChevronUp', 'ChevronDown'] },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    iconName: 'Close',
    'aria-label': 'Close',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <IconButton {...args} size="sm" />
      <IconButton {...args} size="md" />
      <IconButton {...args} size="lg" />
    </div>
  ),
  args: {
    iconName: 'Close',
    'aria-label': 'Close',
  },
};

export const Disabled: Story = {
  args: {
    iconName: 'Close',
    'aria-label': 'Close',
    disabled: true,
  },
};

export const CustomContent: Story = {
  name: 'Custom content (children override)',
  args: {
    'aria-label': 'Custom',
    children: '⭐',
  },
};
