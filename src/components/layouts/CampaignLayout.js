import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreationsList } from "@/components/CreationsList";
import { CampaignsList } from "@/components/CampaignsList";

export function CampaignLayout({ creations, projectId, campaigns }) {
  const [activeTab, setActiveTab] = useState("creations");

  const hasCreations = creations && creations.length > 0;
  const hasCampaigns = campaigns && campaigns.length > 0;

  if (!hasCreations && !hasCampaigns) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <p className="text-lg text-gray-500">No creations or campaigns available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {(hasCreations || hasCampaigns) && (
        <Tabs defaultValue={hasCreations ? "creations" : "campaigns"} className="w-full h-full flex flex-col">
          <TabsList className={`grid w-full ${hasCreations && hasCampaigns ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {hasCreations && (
              <TabsTrigger value="creations" onClick={() => setActiveTab("creations")}>Creations</TabsTrigger>
            )}
            {hasCampaigns && (
              <TabsTrigger value="campaigns" onClick={() => setActiveTab("campaigns")}>Campaigns</TabsTrigger>
            )}
          </TabsList>
          {hasCreations && (
            <TabsContent value="creations" className="flex-grow overflow-auto">
              <CreationsList creations={creations} projectId={projectId} />
            </TabsContent>
          )}
          {hasCampaigns && (
            <TabsContent value="campaigns" className="flex-grow overflow-auto">
              <CampaignsList campaigns={campaigns} projectId={projectId} />
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}
