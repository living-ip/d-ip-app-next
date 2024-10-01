import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {AiOutlineCamera} from "react-icons/ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileCard({profile, ownProfile, votes, changes}) {
	const router = useRouter();
	return (
		<div className="bg-white rounded-xl shadow-md overflow-hidden">
			<div className="p-6 sm:p-8">
				<div className="flex justify-between items-start mb-6">
					<Avatar className="w-24 h-24 sm:w-32 sm:h-32">
						{profile.image_uri ? (
							<AvatarImage
								src={profile.image_uri}
								alt="Profile picture"
								className="rounded-full object-cover"
							/>
						) : (
							<div className="w-full h-full rounded-full bg-gray-100 flex justify-center items-center">
								<AiOutlineCamera size={32} className="text-gray-600"/>
							</div>
						)}
					</Avatar>
					{ownProfile && (
						<Button variant="ghost" onClick={() => router.push('/profile/edit')}>
							Edit
						</Button>
					)}
				</div>
				<div className="text-center mb-6">
					<h1 className="text-3xl sm:text-4xl text-neutral-950 mb-2">
						{profile.name}
					</h1>
				</div>
				<div className="space-y-4 mb-6">
					{ownProfile && (
						<div className="flex justify-between items-center">
							<span className="text-zinc-500">Email</span>
							<span className="text-neutral-950">{profile.email}</span>
						</div>
					)}
					<div className="flex justify-between items-center">
						<span className="text-zinc-500">Joined</span>
						<span className="text-neutral-950">{new Date(profile.created_at).toLocaleDateString()}</span>
					</div>
				</div>
				<Tabs defaultValue="votes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="votes">Votes</TabsTrigger>
            <TabsTrigger value="changes">Changes</TabsTrigger>
          </TabsList>
          <TabsContent value="votes">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Recent Votes</CardTitle>
                <CardDescription>Vote History</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  {votes.sort((a, b) => b.created_at - a.created_at).map((vote) => (
                    <div key={vote.vid} className="mb-4 last:mb-0 p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold">{vote.change.name}</h3>
                      <p className="text-sm text-zinc-500">
                        {vote.change.document.name} - {new Date(vote.created_at).toLocaleDateString()}
                      </p>
                      <Badge variant={vote.vote > 0 ? "green" : "red"} className="mt-2">
                        {vote.vote > 0 ? "Upvote" : "Downvote"}
                      </Badge>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="changes">
            <Card>
              <CardHeader>
                <CardTitle>Recent Changes</CardTitle>
                <CardDescription>Contributions to Documents</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  {changes.sort((a, b) => b.created_at - a.created_at).map((change) => (
                    <div key={change.cid} className="mb-4 last:mb-0 p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold">{change.name}</h3>
                      <p className="text-sm text-zinc-500">
                        {change.document.name} - {new Date(change.created_at).toLocaleDateString()}
                      </p>
                      <Badge variant={change.closed ? "red" : change.merged ? "green" : "default"} className="mt-2">
                        {change.closed ? "Rejected" : change.merged ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
			</div>
		</div>
	);
}