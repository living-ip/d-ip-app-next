import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { CreationCard } from "@/components/cards/CreationCard"
import CreationsVotingDialog from "@/components/vote/CreationsVotingDialog"

export function CampaignLayout({ creations, projectId, campaigns }) {
  return (
    <div className="flex h-full bg-background">
      {/* Left column: Create button, campaign info, and scrollable list of cards */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-2 space-y-2">
          <Button className="w-full">Create New Creation</Button>
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
      {/* Right column: Selected creation details */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 gap-4">
          {creations && creations.length > 0 ? (
            creations.map((creation) => (
              <CreationCard
                key={creation.did}
                creation={creation}
                projectId={projectId}
              />
            ))
          ) : (
            <p>No creations available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
