'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full py-8">
      <div className="max-w-3xl mx-auto">
        {/* Desktop - Horizontal */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isUpcoming = currentStep < step.number;

            return (
              <div key={step.number} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                      transition-all duration-300 relative
                      ${isCompleted ? 'bg-yo-green text-white' : ''}
                      ${isCurrent ? 'bg-yo-orange text-white ring-4 ring-yo-orange/20' : ''}
                      ${isUpcoming ? 'bg-yo-gray-200 text-yo-gray-400' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </motion.div>
                  <div className="mt-3 text-center">
                    <p className={`
                      font-semibold text-sm
                      ${isCurrent ? 'text-yo-orange' : ''}
                      ${isCompleted ? 'text-yo-green' : ''}
                      ${isUpcoming ? 'text-yo-gray-400' : ''}
                    `}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-yo-gray-400 mt-1">{step.description}</p>
                    )}
                  </div>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 relative">
                    <div className="absolute inset-0 bg-yo-gray-200" />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-yo-green"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile - Vertical */}
        <div className="md:hidden space-y-4">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isUpcoming = currentStep < step.number;

            return (
              <div key={step.number} className="flex items-start gap-4">
                {/* Step Circle */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shrink-0
                    ${isCompleted ? 'bg-yo-green text-white' : ''}
                    ${isCurrent ? 'bg-yo-orange text-white ring-4 ring-yo-orange/20' : ''}
                    ${isUpcoming ? 'bg-yo-gray-200 text-yo-gray-400' : ''}
                  `}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.number}
                </motion.div>

                {/* Step Info */}
                <div className="flex-1 pt-1">
                  <p className={`
                    font-semibold text-sm
                    ${isCurrent ? 'text-yo-orange' : ''}
                    ${isCompleted ? 'text-yo-green' : ''}
                    ${isUpcoming ? 'text-yo-gray-400' : ''}
                  `}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-yo-gray-400 mt-1">{step.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
