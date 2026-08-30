import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from './Toaster';
import { Button } from '../Button/Button';
import { errorToToast, showToast } from './toasterStore';
import { t } from '../../../.storybook/i18n';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Toaster',
  component: Toaster,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A global toast stack rendered via a portal to `document.body`. `showToast`/`killAToastById`/`errorToToast` are plain functions you can call from anywhere in your app — no provider or hook wiring required, `<Toaster />` just needs to be mounted once near the app root.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Playground: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', padding: '2rem' }}>
      <Button mode="main" onClick={() => showToast({ type: 'success', content: 'Changes saved successfully' })}>
        Success toast
      </Button>
      <Button
        mode="danger"
        onClick={() =>
          showToast({
            type: 'error',
            headline: 'Save failed',
            content: 'Something went wrong while saving your changes',
          })
        }
      >
        Error toast
      </Button>
      <Button
        mode="secondary"
        onClick={() => showToast({ type: 'warn', content: 'Your session will expire in 5 minutes' })}
      >
        Warning toast
      </Button>
      <Button
        mode="secondary"
        onClick={() => showToast({ type: 'info', content: 'A new version is available' })}
      >
        Info toast
      </Button>
      <Button
        mode="text"
        onClick={() =>
          showToast(
            errorToToast({
              response: {
                data: { errorCode: 'rate_limit-exceeded', errorMessage: 'too_many.requests' },
              },
            })
          )
        }
      >
        Toast from API error
      </Button>
      <Button
        mode="text"
        onClick={() => {
          for (let i = 1; i <= 8; i++) {
            showToast({ type: 'info', content: `Toast #${i}` });
          }
        }}
      >
        Spam 8 toasts (caps at ~5)
      </Button>

      <Toaster t={t} />
    </div>
  ),
};
