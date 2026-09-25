import React from 'react'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => {
    const baseStyles = 'mt-1 w-full rounded-lg bg-white border border-brand-secondary p-2 invalid:border-brand-secondary invalid:text-pink-600 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:invalid:border-brand-primary focus:invalid:outline-brand-primary disabled:border-gray-200 disabled:bg-brand-senary disabled:text-brand-tertiary disabled:shadow-none'

    return (
      <textarea
        ref={ref}
        className={`${baseStyles} ${className}`}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
