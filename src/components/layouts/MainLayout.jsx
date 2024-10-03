import React from 'react'
import {NavBar} from "@/components/custom/NavBar";

export function MainLayout({children}) {

	return (
		<div className="flex flex-col min-h-screen bg-neutral-100">
			<NavBar/>
			<div className="flex-grow overflow-y-auto w-full px-4">
				{children}
			</div>
		</div>
	)
}
