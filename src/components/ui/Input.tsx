import React from 'react'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    const baseStyles = 'mt-1 w-full rounded-lg bg-white border border-brand-secondary p-2 invalid:border-brand-secondary invalid:text-pink-600 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:invalid:border-brand-primary focus:invalid:outline-brand-primary disabled:border-gray-200 disabled:bg-brand-senary disabled:text-brand-tertiary disabled:shadow-none'

    return (
      <input
        ref={ref}
        className={`${baseStyles} ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', ...props }, ref) => {
    const baseStyles = 'mt-1 w-full rounded-lg bg-white border border-brand-secondary p-2 invalid:border-brand-secondary invalid:text-pink-600 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:invalid:border-brand-primary focus:invalid:outline-brand-primary disabled:border-gray-200 disabled:bg-brand-senary disabled:text-brand-tertiary disabled:shadow-none'

    return (
      <select
        ref={ref}
        className={`${baseStyles} ${className}`}
        {...props}
      />
    )
  }
)

Select.displayName = 'Select'
