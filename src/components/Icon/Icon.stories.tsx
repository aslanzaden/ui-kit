import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    iconName: {
      control: 'select',
      options: [
        'ArrowRight',
        'Eye',
        'EyeOff',
        'ChevronUp',
        'ChevronDown',
        'ChevronLeft',
        'ChevronRight',
        'ChevronsLeft',
        'ChevronsRight',
        'Close',
        'CircleX',
        'CircleAlert',
        'CircleCheck',
        'CircleHelp',
        'CircleMinus',
        'CirclePlus',
        'Ellipsis',
        'Columns3',
      ],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'foreground', 'muted_foreground', 'destructive', 'success', 'warn'],
    },
    colorMode: { control: 'radio', options: ['light', 'dark'] },
    size: { control: 'text' },
    fill: { control: 'boolean' },
    hover: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    iconName: 'ArrowRight',
    color: 'primary',
    colorMode: 'light',
    size: '2rem',
    fill: false,
    hover: false,
  },
};

export const Filled: Story = {
  args: { ...Default.args, fill: true },
};

export const HoverToggle: Story = {
  name: 'Hover to toggle fill',
  args: { ...Default.args, hover: true },
};

export const DarkMode: Story = {
  args: { ...Default.args, colorMode: 'dark', color: 'primary' },
  parameters: { backgrounds: { default: 'dark' } },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {['1rem', '1.5rem', '2rem', '3rem', '4rem'].map((s) => (
        <Icon key={s} iconName="ArrowRight" size={s} color="primary" colorMode="light" />
      ))}
    </div>
  ),
};

export const ColorTokens: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
      {(['primary', 'destructive', 'success', 'warn', 'muted_foreground'] as const).map((c) => (
        <div key={c} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <Icon iconName="ArrowRight" size="2rem" color={c} colorMode="light" />
          <span style={{ fontSize: '0.65rem', color: '#71717a' }}>{c}</span>
        </div>
      ))}
    </div>
  ),
};