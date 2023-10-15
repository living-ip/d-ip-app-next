import clsx from 'clsx'
import React from 'react'

export function Container({ className, ...props }) {
	return (
		<>
			<div
				className={clsx(
					'mx-auto max-w-full px-8 sm:px-16 lg:px-32',
					className
				)}
				{...props}
			/>
		</>
	)
}
