import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { CreationCard } from "@/components/cards/CreationCard"
import CreationsVotingDialog from "@/components/vote/CreationsVotingDialog"
import CreateCreationDialog from "@/components/CreateCreationDialog"
import { getCreationSubmissions } from "@/lib/creations"
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { useCreateBlockNote } from "@blocknote/react"
import "@blocknote/core/style.css"
import ReactMarkdown from 'react-markdown'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"

const BlockNoteContent = ({ content }) => {
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

const SubmissionDialog = ({ isOpen, setIsOpen, submission }) => {
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{submission.user_name}'s Submission</DialogTitle>
				</DialogHeader>
				<BlockNoteContent content={submission.content} />
			</DialogContent>
		</Dialog>
	);
};

export function CampaignLayout({ creations, projectId, campaigns }) {
	const [selectedCreation, setSelectedCreation] = useState(null)
	const [submissions, setSubmissions] = useState([])
	const [selectedSubmission, setSelectedSubmission] = useState(null)
	const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false)

	useEffect(() => {
		if (selectedCreation) {
			const fetchSubmissions = async () => {
				const result = await getCreationSubmissions(projectId, selectedCreation.creid, getAuthToken())
				const submissionsWithContent = await Promise.all(
					(result.submissions || []).map(async (submission) => {
						try {
							const contentResponse = await fetch(submission.uri);
							const contentJson = await contentResponse.text();
							return { ...submission, content: contentJson };
						} catch (error) {
							console.error('Error fetching submission content:', error);
							return { ...submission, content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Error loading content"}]}]}' };
						}
					})
				);
				setSubmissions(submissionsWithContent);
			}
			fetchSubmissions()
		}
	}, [selectedCreation, projectId])
	return (
		<div className="flex h-full bg-background">
			{/* Left column: Create button, campaign info, and scrollable list of cards */}
			<div className="w-1/3 border-r flex flex-col">
				<div className="p-2 space-y-2">
					<CreateCreationDialog>
						<Button className="w-full">Create New Creation</Button>
					</CreateCreationDialog>
					{campaigns && campaigns.length > 0 && (
						<CreationsVotingDialog campaign={campaigns[0]}>
							<Button variant="outline" className="w-full">
								{campaigns.length} Active {campaigns.length === 1 ? 'Campaign' : 'Campaigns'}
							</Button>
						</CreationsVotingDialog>
					)}
				</div>
				<ScrollArea className="flex-1">
					<div className="p-2 space-y-2">
						{creations && creations.length > 0 ? (
							creations.map((creation) => (
								<Card
									key={creation.did}
									className="w-full cursor-pointer transition-colors hover:bg-accent"
									onClick={() => setSelectedCreation(creation)}
								>
									<CardHeader>
										<CardTitle>{creation.title}</CardTitle>
									</CardHeader>
								</Card>
							))
						) : (
							<p>No creations available.</p>
						)}
					</div>
				</ScrollArea>
			</div>
			{/* Right column: Selected creation details or submissions grid */}
			<div className="flex-1 p-6 overflow-auto">
				{selectedCreation ? (
					<div className="space-y-6">
						<CreationCard
							creation={selectedCreation}
							projectId={projectId}
						/>
						<div>
							<h2 className="text-2xl font-bold mb-4">Submissions</h2>
							<div className="grid grid-cols-3 gap-4">
								{submissions.length > 0 ? (
									submissions.map((submission) => (
										<Card 
											key={submission.id} 
											className="w-full h-64 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
											onClick={() => {
												setSelectedSubmission(submission);
												setIsSubmissionDialogOpen(true);
											}}
										>
											<CardContent className="p-0 w-full h-full flex flex-col">
												<div className="flex-grow overflow-auto">
													{submission.content ? (
														<BlockNoteContent content={submission.content} />
													) : (
														<div className="p-4">Loading submission content...</div>
													)}
												</div>
												<div className="p-2 bg-background">
													<CardTitle className="text-sm truncate">{submission.user_name}</CardTitle>
												</div>
											</CardContent>
										</Card>
									))
								) : (
									<p className="col-span-3">No submissions available for this creation.</p>
								)}
							</div>
							{selectedSubmission && (
								<SubmissionDialog
									isOpen={isSubmissionDialogOpen}
									setIsOpen={setIsSubmissionDialogOpen}
									submission={selectedSubmission}
								/>
							)}
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center h-full">
						<p className="text-lg text-gray-500">Select a creation to view details</p>
					</div>
				)}
			</div>
		</div>
	);
}
