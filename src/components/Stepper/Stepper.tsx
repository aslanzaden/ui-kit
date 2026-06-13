import React from 'react';
import './Stepper.css';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Step {
  title: string;
  subtitle: string;
}

export type Steps = Step[];

// ─── Component ───────────────────────────────────────────────────────────────

export interface StepperProps {
  steps: Steps;
  currentStep: number;
  /** i18n helper – defaults to identity */
  t?: (key: string) => string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  t = (k) => k,
}) => {
  return (
    <div className="app-stepper">
      {steps.map((step, index) => {
        const isActive = index <= currentStep;

        return (
          <div
            key={index}
            className={`app-stepper__step${isActive ? ' app-stepper__step--active' : ''}`}
          >
            <div className="app-stepper__step-number">
              <span>{index + 1}</span>
            </div>
            <div className="app-stepper__step-info">
              <span className="app-stepper__step-title">{t(step.title)}</span>
              <span className="app-stepper__step-subtitle">{t(step.subtitle)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;