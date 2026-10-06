// src/components/ui/Card.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'bg-white rounded-lg border border-gray-200 shadow-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
