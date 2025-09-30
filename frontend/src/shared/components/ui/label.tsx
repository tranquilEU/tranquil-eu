import { cn } from '@/shared/lib/utils';
// eslint-disable-next-line no-restricted-imports
import * as LabelPrimitive from '@radix-ui/react-label';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const labelVariants = cva(
	'flex items-center gap-2 leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
	{
		variants: {
			size: {
				sm: 'text-xs',
				md: 'text-sm',
				lg: 'text-base'
			},
			type: {
				default: 'text-foreground',
				error: 'text-red-600 dark:text-red-500',
				alert: 'text-yellow-600 dark:text-yellow-500',
				success: 'text-green-600 dark:text-green-500'
			}
		},
		defaultVariants: {
			size: 'md',
			type: 'default'
		}
	}
);

export interface LabelProps
	extends React.ComponentProps<typeof LabelPrimitive.Root>,
		VariantProps<typeof labelVariants> {}

function Label({ className, size, type, ...props }: LabelProps) {
	return (
		<LabelPrimitive.Root
			data-slot="label"
			className={cn(labelVariants({ size, type }), className)}
			{...props}
		/>
	);
}

export { Label };
