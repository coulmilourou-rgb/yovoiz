import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  warning?: boolean;
  icon?: React.ReactNode;
  maxLength?: number;
  showCount?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    label, 
    error, 
    helperText, 
    success, 
    warning,
    icon,
    maxLength,
    showCount,
    required,
    disabled,
    value,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <motion.label
            className={cn(
              'block text-sm font-semibold mb-2 transition-colors',
              error ? 'text-red-600' : success ? 'text-green-600' : 'text-yo-gray-700'
            )}
            animate={{
              y: isFocused && value ? -2 : 0,
              scale: isFocused && value ? 0.95 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {required && <span className="text-yo-orange ml-1">*</span>}
          </motion.label>
        )}

        <div className="relative">
          {/* Icon à gauche */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yo-gray-400">
              {icon}
            </div>
          )}

          <input
            type={inputType}
            className={cn(
              'w-full px-4 py-3 rounded-yo-lg border-2 transition-all duration-200',
              'placeholder:text-yo-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-yo-gray-50',
              {
                'border-yo-gray-300 focus:border-yo-green focus:ring-yo-green/20': !error && !success && !warning,
                'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50': error,
                'border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50': success,
                'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20 bg-yellow-50': warning,
                'pl-11': icon,
                'pr-20': isPassword || success || warning,
              },
              className
            )}
            ref={ref}
            disabled={disabled}
            value={value}
            maxLength={maxLength}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Indicateurs de statut à droite */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {success && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
              </motion.div>
            )}

            {warning && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
              </motion.div>
            )}

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-yo-gray-400 hover:text-yo-gray-600 transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Messages d'aide et compteur */}
        <AnimatePresence mode="wait">
          {(error || helperText || (showCount && maxLength)) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-center justify-between"
            >
              <p
                className={cn('text-sm', {
                  'text-red-600': error,
                  'text-yo-gray-600': !error,
                })}
              >
                {error || helperText}
              </p>

              {showCount && maxLength && (
                <span
                  className={cn('text-xs', {
                    'text-red-600': currentLength >= maxLength,
                    'text-yo-gray-500': currentLength < maxLength,
                  })}
                >
                  {currentLength}/{maxLength}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
