import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Stepper } from './Stepper';
import type { Steps } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A horizontal stepper that tracks progress through a multi-step process. Completed steps show a Done icon; the active and upcoming steps show their number.',
      },
    },
  },
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 0 },
      description: 'Zero-based index of the current step',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

// ── Shared data ──────────────────────────────────────────────────────────────

const checkoutSteps: Steps = [
  { title: 'Cart', subtitle: 'Review items' },
  { title: 'Shipping', subtitle: 'Enter address' },
  { title: 'Payment', subtitle: 'Add card details' },
  { title: 'Confirm', subtitle: 'Place your order' },
];

const onboardingSteps: Steps = [
  { title: 'Account', subtitle: 'Create your profile' },
  { title: 'Team', subtitle: 'Invite members' },
  { title: 'Settings', subtitle: 'Configure workspace' },
];

// ── Stories ──────────────────────────────────────────────────────────────────

/** First step active, none completed */
export const StepOne: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 0,
  },
};

/** Second step active, first completed */
export const StepTwo: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 1,
  },
};

/** Third step active */
export const StepThree: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 2,
  },
};

/** All steps completed */
export const AllCompleted: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: checkoutSteps.length - 1,
  },
};

/** Shorter 3-step onboarding flow */
export const OnboardingFlow: Story = {
  args: {
    steps: onboardingSteps,
    currentStep: 1,
  },
};

/** Single step */
export const SingleStep: Story = {
  args: {
    steps: [{ title: 'Confirm', subtitle: 'Review and submit' }],
    currentStep: 0,
  },
};

/** Interactive — click Next / Back to advance through steps */
export const Interactive: Story = {
  render: () => {
    const [current, setCurrent] = useState(0);
    const steps = checkoutSteps;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Stepper steps={steps} currentStep={current} />
        <div style={{ display: 'flex', gap: '0.75rem', padding: '0 1rem' }}>
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              cursor: current === 0 ? 'not-allowed' : 'pointer',
              opacity: current === 0 ? 0.5 : 1,
              background: 'white',
            }}
          >
            Back
          </button>
          <button
            onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
            disabled={current === steps.length - 1}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              background: '#6366f1',
              color: 'white',
              cursor: current === steps.length - 1 ? 'not-allowed' : 'pointer',
              opacity: current === steps.length - 1 ? 0.5 : 1,
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};