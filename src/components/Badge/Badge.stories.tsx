import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import type { BadgeVariant } from './Badge.types';

const ALL_VARIANTS: BadgeVariant[] = [
  'default', 'secondary', 'outline', 'outline-success', 'destructive',
  'warning', 'green', 'lime', 'emerald', 'teal', 'cyan', 'cyan-light',
  'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
  'navy', 'gray', 'neutral-light', 'white', 'green-light', 'none',
  'vivid-purple', 'bright-blue', 'rose-red',
];

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ALL_VARIANTS },
    icon: { control: 'select', options: [undefined, 'ArrowRight'] },
    iconColor: {
      control: 'select',
      options: ['primary_foreground', 'foreground', 'muted_foreground', 'destructive', 'success'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { variant: 'default', children: 'Badge' },
};

export const WithIcon: Story = {
  args: { variant: 'default', icon: 'ArrowRight', children: 'With icon' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Error' },
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '1rem' }}>
      {ALL_VARIANTS.map((v) => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
};

export const AllWithIcon: Story = {
  name: 'All variants with icon',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '1rem' }}>
      {ALL_VARIANTS.map((v) => (
        <Badge key={v} variant={v} icon="ArrowRight">
          {v}
        </Badge>
      ))}
    </div>
  ),
};