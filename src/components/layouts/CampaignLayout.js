import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreationsList } from "@/components/CreationsList";
import { CampaignsList } from "@/components/CampaignsList";

export function CampaignLayout({ creations, projectId, campaigns }) {
  const [activeTab, setActiveTab] = useState("creations");

  return (
    <div className="flex flex-col h-screen">
      <Tabs defaultValue="creations" className="w-full h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="creations" onClick={() => setActiveTab("creations")}>Creations</TabsTrigger>
          <TabsTrigger value="campaigns" onClick={() => setActiveTab("campaigns")}>Campaigns</TabsTrigger>
        </TabsList>
        <TabsContent value="creations" className="flex-grow overflow-auto">
          <CreationsList creations={creations} projectId={projectId} />
        </TabsContent>
        <TabsContent value="campaigns" className="flex-grow overflow-auto">
          <CampaignsList campaigns={campaigns} projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
