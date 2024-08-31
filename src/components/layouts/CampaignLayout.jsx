import { useState, useEffect } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { CreationCard } from "@/components/cards/CreationCard"
import CreationsVotingDialog from "@/components/vote/CreationsVotingDialog"
import CreateCreationDialog from "@/components/CreateCreationDialog"
import { getCreationSubmissions } from "@/lib/creations"

export function CampaignLayout({ creations, projectId, campaigns }) {
  const [selectedCreation, setSelectedCreation] = useState(null)
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    if (selectedCreation) {
      const fetchSubmissions = async () => {
        const jwt = "YOUR_JWT_TOKEN" // Replace this with the actual JWT token
        const result = await getCreationSubmissions(projectId, selectedCreation.did, jwt)
        setSubmissions(result.submissions || [])
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
										<CardTitle>{creation.name}</CardTitle>
										<CardDescription>{creation.description}</CardDescription>
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
					<div>
						<h2 className="text-2xl font-bold mb-4">{selectedCreation.name} Submissions</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{submissions.length > 0 ? (
								submissions.map((submission) => (
									<Card key={submission.id} className="cursor-pointer hover:bg-accent">
										<CardHeader>
											<CardTitle>{submission.user_name || 'Anonymous'}</CardTitle>
											<CardDescription>{submission.content.slice(0, 100)}...</CardDescription>
										</CardHeader>
									</Card>
								))
							) : (
								<p>No submissions available for this creation.</p>
							)}
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4">
						{creations && creations.length > 0 ? (
							creations.map((creation) => (
								<CreationCard
									key={creation.did}
									creation={creation}
									projectId={projectId}
									onClick={() => setSelectedCreation(creation)}
								/>
							))
						) : (
							<p>No creations available.</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
