import { useState } from 'react'
import clsx from 'clsx'

const formClasses =
	'block w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:outline-none focus:ring-slate-500 sm:text-sm'

function Label({ id, children }) {
	return (
		<label
			htmlFor={id}
			className="block mb-2 text-sm font-semibold text-gray-900"
		>
			{children}
		</label>
	)
}

export function TextField({ label, type = 'text', className, ...props }) {
	const [id] = useState(
		() => `input-${Math.random().toString(36).substr(2, 9)}`
	)

	return (
		<div className={className}>
			{label && <Label id={id}>{label}</Label>}
			<input id={id} type={type} {...props} className={formClasses} />
		</div>
	)
}

export function SelectField({ label, className, ...props }) {
	const [id] = useState(
		() => `select-${Math.random().toString(36).substr(2, 9)}`
	)

	return (
		<div className={className}>
			{label && <Label id={id}>{label}</Label>}
			<select id={id} {...props} className={clsx(formClasses, 'pr-8')} />
		</div>
	)
}
