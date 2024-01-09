import clsx from 'clsx'
import React from 'react'
import NavBar from "@/components/NavBar";
import {Footer} from "@/components/ui/footer";

export function Container({ children, className, ...props }) {
	return (
		<div {...props}>
			<div className="fixed top-0 w-full z-10 bg-white">
				<NavBar/>
			</div>
			<div className={clsx('mx-auto max-w-full px-3 sm:px-16 lg:px-32', className)}>
				{children}
			</div>
			<Footer className="w-full"/>
		</div>
	)
}
