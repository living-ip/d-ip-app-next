import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { authStytchRequest } from "@/lib/stytch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createDocumentChange } from "@/lib/document";
import { Layout } from "@/components/ui/layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertNameToGithubRepo } from "@/lib/utils";
import {getProject} from "@/lib/project";
import {getDocument, getDocumentChanges} from "@/lib/document";
import {getCookie} from "cookies-next";

export default function Index({ project, document, changes }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("not-published");

  const newEditHandler = async (document) => {
    const change = await createDocumentChange(
      document.did,
      {
        name: name,
        description: "",  // TODO: Update dialog box to ask for description and adjust here
      },
      getCookie("stytch_session_jwt")
    );
    await router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/edit/${change.cid}`);
  };

  const existingEditHandler = async (changeId) => {
    await router.push(`/projects/${encodeURI(project.pid)}/document/${encodeURIComponent(document.did)}/edit/${changeId}`);
  };

  function handleChange(event) {
    const selectedSha = event.target.value;
    // Find the section with the selected sha
    const selectedSection = chapters
      .flatMap((chapter) => chapter.sections)
      .find((section) => section.sha === selectedSha);

    setSelectedChapter(selectedSection);
  }

  return (
    <Layout>
      <div className="flex-1">
        <div className="my-10 text-4xl font-extrabold">{document.name}</div>
        <Label className="py-6 text-sm text-muted-foreground">
          Your Changes:
        </Label>
        <div className="mt-8 mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mx-8">New Change</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Change</DialogTitle>
              </DialogHeader>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) =>
                    setName(convertNameToGithubRepo(e.target.value))
                  }
                  className="block w-full p-2 mt-1 border border-gray-300 rounded-lg"
                />
              </div>
              <Button type="submit" className="ml-2" onClick={() => newEditHandler(document)}>
                Create Change
              </Button>
            </DialogContent>
          </Dialog>
          <Select
              className="ml-2"
              onValueChange={(value) => setFilteredStatus(value)}
              value={filteredStatus}
            >
              <SelectTrigger className="w-[180px] mt-8">
                <SelectValue>
                  {filteredStatus === "published"
                    ? "Published"
                    : "Not Published"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="not-published">Not Published</SelectItem>
              </SelectContent>
            </Select>
        </div>
        <div className="flex flex-col h-full mb-96">
          <div className="w-full">
            {changes
              .filter((change) => {
                switch (filteredStatus) {
                  case "published":
                    return change.published;
                  case "not-published":
                    return !change.published;
                  default:
                    return true;
                }
              })
              .map((change, index) => (
                <div
                  key={index}
                  className="py-8 border-b-2 cursor-pointer"
                  onClick={() => existingEditHandler(change.cid)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold">{change.title}</div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-sm text-gray-600 space-y-2">
                      <div>Name: {change.name}</div>
                      <div>Description: {change.description}</div>
                      <div>Creation Time: {change.created_at}</div>
                    </div>
                    {change.published ? (
                      <div className="text-sm text-gray-600">Published</div>
                    ) : (
                      <div className="text-sm text-gray-600">Not Published</div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({ req, query }) => {
  const { session } = await authStytchRequest(req);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const {pid, documentId} = query;
  console.log("Pid: ", pid);
  console.log("Document ID: ", documentId);

  const sessionJWT = req.cookies["stytch_session_jwt"];

  const project = await getProject(pid, sessionJWT);
  console.log("Project: ", project);
  const document = await getDocument(documentId, sessionJWT);
  console.log("Document: ", document);
  const unpublishedChanges = await getDocumentChanges(documentId, {
    "published": false,
    "user_id": session.user_id,
  }, sessionJWT);
  console.log("Unpublished Changes: ", unpublishedChanges);

  const orderedChanges = unpublishedChanges.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  console.log("Ordered Changes: ", orderedChanges);


  return {
    props: {
      project: project,
      document: document,
      changes: orderedChanges,
    },
  };
};
