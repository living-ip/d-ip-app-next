import React from 'react';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {BotMessageSquare} from "lucide-react";
import HomeChat from "@/components/chat/HomeChat";
import {Separator} from "@/components/ui/separator";
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";

const MobileChatSheet = () => {
	const {isAuthenticated, user} = useDynamicContext()

	if (!isAuthenticated) {
		return null;
	}

	return (
		<Sheet>
			<SheetTrigger asChild>
				<button className="p-2 text-primary">
					<BotMessageSquare className="h-6 w-6"/>
				</button>
			</SheetTrigger>
			<SheetContent
				side="bottom"
				className="h-[calc(100vh-5rem)]"
			>
				<SheetHeader>
					<SheetTitle>AI Chat</SheetTitle>
					<Separator/>
				</SheetHeader>
				<div className="h-[calc(100vh-10rem)] overflow-hidden pt-2">
					<HomeChat contextId={`userHome-${user.userId}`}/>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileChatSheet;
