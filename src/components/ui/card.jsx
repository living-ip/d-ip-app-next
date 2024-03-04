import * as React from 'react'

import { cn } from '@/lib/utils'
import Image from 'next/image'

const Card = React.forwardRef(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'rounded-lg border bg-card text-card-foreground drop-shadow-lg w-96 h-full',
			className
		)}
		{...props}
	/>
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('flex flex-col space-y-1.5 p-8', className)}
		{...props}
	/>
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			'text-2xl font-semibold mb-6 leading-none tracking-tight',
			className
		)}
		{...props}
	/>
))
CardTitle.displayName = 'CardTitle'

const CardImage = React.forwardRef(({ src, alt, className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'relative w-full h-full overflow-hidden flex items-center justify-center',
			className
		)}
		{...props}
	>
		<Image
			src={src}
			alt={alt}
			width={1600}
			height={600}
			objectFit="cover"
			objectPosition="center"
		/>
	</div>
))
CardImage.displayName = 'CardImage'

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn('text-sm py-6 text-muted-foreground', className)}
		{...props}
	/>
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
	<div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('flex items-center p-6 pt-0', className)}
		{...props}
	/>
))
CardFooter.displayName = 'CardFooter'

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent,
	CardImage,
}
