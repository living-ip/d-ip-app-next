'use client'

import {useEffect, useState} from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {HeartIcon, XIcon} from 'lucide-react'
import {AnimatePresence, motion} from 'framer-motion'
import {getVotingCampaign, voteOnEntry} from '@/lib/creations'
import ReactMarkdown from 'react-markdown'
import {useCreateBlockNote} from "@blocknote/react"
import "@blocknote/core/style.css"

const variants = {
	hidden: {opacity: 0},
	visible: {opacity: 1},
	exit: {opacity: 0}
}

const ExplanationScreen = ({onBegin, campaign}) => (
	<motion.div
		initial="hidden"
		animate="visible"
		exit="exit"
		variants={variants}
		className="text-center py-4"
	>
		<h3 className="text-lg font-semibold mb-4">{campaign.creation_request.title}</h3>
		<p className="text-sm text-muted-foreground mb-4">
			{campaign.creation_request.description}
		</p>
		{campaign.creation_request.reward && (
			<p className="text-sm font-semibold mb-6">
				Reward: {campaign.creation_request.reward}
			</p>
		)}
		<Button onClick={onBegin}>Begin Voting</Button>
	</motion.div>
);

const BlockNoteContent = ({content}) => {
	const editor = useCreateBlockNote({
		initialContent: JSON.parse(content),
		editable: false
	});

	const [markdown, setMarkdown] = useState('');

	useEffect(() => {
		editor.blocksToMarkdownLossy().then(md => {
			setMarkdown(md);
		});
	}, [editor]);

	return (
		<div className="prose prose-sm max-w-none p-6">
			<ReactMarkdown className="text-black space-y-4">{markdown}</ReactMarkdown>
		</div>
	);
};

export default function CreationsVotingDialog({children, campaign}) {
	const [currentProposal, setCurrentProposal] = useState(0)
	const [isOpen, setIsOpen] = useState(false)
	const [matches, setMatches] = useState([])
	const [hasStartedVoting, setHasStartedVoting] = useState(false)
	const [isExpanded, setIsExpanded] = useState(false)
	const [proposals, setProposals] = useState([])

	useEffect(() => {
		if (isOpen && campaign) {
			getVotingCampaign(campaign.creation_request.project_id, campaign.campaign.cvcid)
				.then(async response => {
					if (response.entries) {
						const proposalsWithContent = await Promise.all(response.entries.map(async entry => {
							const contentResponse = await fetch(entry.user_creation.uri);
							const contentJson = await contentResponse.text();
							return {...entry, content: contentJson};
						}));
						setProposals(proposalsWithContent);
					}
				})
				.catch(error => console.error('Error fetching creations:', error))
		}
	}, [isOpen, campaign])

	const paginate = (newDirection) => {
		if (currentProposal + newDirection >= 0 && currentProposal + newDirection < proposals.length) {
			setCurrentProposal(currentProposal + newDirection)
			setIsExpanded(false) // Reset expanded state when changing proposals
		} else {
			setCurrentProposal(proposals.length) // Move to summary
		}
	}

	const handleVote = async (vote) => {
		try {
			await voteOnEntry(
				campaign.creation_request.project_id,
				campaign.campaign.cvcid,
				proposals[currentProposal].cveid,
				vote
			);
			if (vote === 1) {
				setMatches([...matches, proposals[currentProposal].id]);
			}
			paginate(1);
		} catch (error) {
			console.error('Error voting:', error);
			// You might want to add some user feedback here
		}
	}

	const handleAccept = () => handleVote(1);
	const handleReject = () => handleVote(0);

	const handleBeginVoting = () => {
		setHasStartedVoting(true)
	}

	const handleCloseDialog = () => {
		setIsOpen(false)
		setHasStartedVoting(false)
		setCurrentProposal(0)
		setMatches([])
		setIsExpanded(false)
		setProposals([])
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{campaign.creation_request.title}</DialogTitle>
					<DialogDescription>
						{campaign.creation_request.description}
					</DialogDescription>
				</DialogHeader>
				<div className="relative w-full">
					<AnimatePresence mode="wait">
						{!hasStartedVoting ? (
							<ExplanationScreen key="explanation" onBegin={handleBeginVoting} campaign={campaign}/>
						) : currentProposal < proposals.length ? (
							<motion.div
								key={currentProposal}
								variants={variants}
								initial="hidden"
								animate="visible"
								exit="exit"
								transition={{duration: 0.3}}
								className="w-full"
							>
								<Card className="w-full">
									<CardContent className="p-0 w-full">
										<BlockNoteContent content={proposals[currentProposal].content}/>
										<div className="flex justify-center space-x-4 mt-4 w-full p-6 pb-8"> {/* Added padding */}
											<Button variant="outline" size="icon" onClick={handleReject}>
												<XIcon className="h-4 w-4"/>
											</Button>
											<Button variant="outline" size="icon" onClick={handleAccept}>
												<HeartIcon className="h-4 w-4"/>
											</Button>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						) : (
							<motion.div
								key="summary"
								variants={variants}
								initial="hidden"
								animate="visible"
								exit="exit"
								className="w-full" // Added w-full
							>
								<div className="text-center py-4 w-full"> {/* Added w-full */}
									<p className="text-lg font-semibold mb-2">Voting Complete!</p>
									<p className="text-sm text-muted-foreground mb-4">You voted for {matches.length} art
										pieces.</p>
									<p className="text-sm text-muted-foreground mb-4">Thank you for participating in the
										Future Art Challenge!</p>
									<Button onClick={handleCloseDialog}>Close</Button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</DialogContent>
		</Dialog>
	)
}
