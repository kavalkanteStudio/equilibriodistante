import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'rounded-lg bg-brand-secondary hover:bg-brand-primary px-4 py-2 font-bold text-white/80 hover:text-white disabled:opacity-50 border border-transparent transition-colors',
      secondary: 'rounded-lg border border-brand-secondary text-gray-900/50 hover:text-gray-900/70 hover:bg-brand-secondary/10 px-4 py-2 font-bold transition-colors',
      ghost: 'rounded-md p-2 text-brand-primary hover:bg-brand-primary/10 transition-colors',
      danger: 'rounded-md p-2 text-brand-secondary hover:bg-brand-secondary/10 transition-colors',
    }

    return (
      <button
        ref={ref}
        className={`${variants[variant]} ${className}`}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
