import { cn } from '@/shared/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type { JSX } from 'react';
import * as React from 'react';

// Map size to both element and style
const headingVariants = cva('font-bold tracking-tight text-gray-900', {
	variants: {
		size: {
			h1: 'text-4xl',
			h2: 'text-3xl',
			h3: 'text-2xl',
			h4: 'text-xl',
			h5: 'text-lg',
			h6: 'text-base'
		}
	},
	defaultVariants: {
		size: 'h2'
	}
});

export interface HeadingProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof headingVariants> {}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, size = 'h2', ...props }, ref) => {
		const Comp = size as keyof JSX.IntrinsicElements; // pick correct HTML tag

		return React.createElement(Comp, {
			ref,
			className: cn(headingVariants({ size }), className),
			...props
		});
	}
);

Heading.displayName = 'Heading';
