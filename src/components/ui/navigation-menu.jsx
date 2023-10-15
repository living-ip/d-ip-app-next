import * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { cva } from 'class-variance-authority'
import { ApertureIcon, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const NavigationMenu = React.forwardRef(
	({ className, children, ...props }, ref) => (
		<NavigationMenuPrimitive.Root
			ref={ref}
			className={cn(
				'relative z-10 mt-8 flex max-w-max flex-1 items-center justify-between lg:justify-center',
				className
			)}
			{...props}
		>
			{children}
			<NavigationMenuViewport />
		</NavigationMenuPrimitive.Root>
	)
)
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const MobileNavigationToggle = ({ onClick, isOpen }) => (
	<>
		<Image
			src="/living-ip.png"
			className="hidden sm:mr-4 sm:flex"
			width={40}
			height={40}
			alt="LivingIP"
		/>

		<button onClick={onClick} className="p-4 lg:hidden">
			<ApertureIcon
				className={`transition-transform duration-300 ${
					isOpen ? 'transform rotate-180' : ''
				}`}
			/>
		</button>
	</>
)

const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.List
		ref={ref}
		className={cn(
			'group flex flex-1 list-none items-center justify-center ml-6 space-x-10',
			className
		)}
		{...props}
	/>
))

NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
	'group inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
)

const NavigationMenuTrigger = React.forwardRef(
	({ className, children, ...props }, ref) => (
		<NavigationMenuPrimitive.Trigger
			ref={ref}
			className={cn(navigationMenuTriggerStyle(), 'group', className)}
			{...props}
		>
			{children}{' '}
			<ChevronDown
				className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
				aria-hidden="true"
			/>
		</NavigationMenuPrimitive.Trigger>
	)
)
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef(
	({ className, ...props }, ref) => (
		<NavigationMenuPrimitive.Content
			ref={ref}
			className={cn(
				'left-0 top-0 w-full md:w-auto data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute',
				className
			)}
			{...props}
		/>
	)
)

NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef(
	({ className, ...props }, ref) => (
		<div className={cn('absolute left-0 top-full flex justify-center')}>
			<NavigationMenuPrimitive.Viewport
				className={cn(
					'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
					className
				)}
				ref={ref}
				{...props}
			/>
		</div>
	)
)
NavigationMenuViewport.displayName =
	NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef(
	({ className, ...props }, ref) => (
		<NavigationMenuPrimitive.Indicator
			ref={ref}
			className={cn(
				'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
				className
			)}
			{...props}
		>
			<div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
		</NavigationMenuPrimitive.Indicator>
	)
)
NavigationMenuIndicator.displayName =
	NavigationMenuPrimitive.Indicator.displayName

export {
	navigationMenuTriggerStyle,
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuContent,
	NavigationMenuTrigger,
	NavigationMenuLink,
	NavigationMenuIndicator,
	NavigationMenuViewport,
	MobileNavigationToggle,
}
