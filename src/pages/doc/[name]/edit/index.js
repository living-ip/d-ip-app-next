import NavBar from "@/components/NavBar";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import prisma from "@/lib/prisma";
import {authStytchRequest} from "@/lib/stytch";
import {Label} from "@/components/ui/label";
import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import { createChange } from "@/lib/change";
import { getRepoTreeRecursive } from "@/lib/github";
import { getCookie } from "cookies-next";

export default function Index({doc, changes, chapters}) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [selectedChapter, setSelectedChapter] = useState(null);

    const onClick = () => {
        router.back();
    };

    const newEditHandler = async () => {
        const { changeId } = await createChange({
            documentId: doc.did,
            owner: doc.owner,
            repo: doc.repo,
            title: editTitle,
        })
        router.push(`/doc/${doc.name}/edit/${changeId}`);
    };

    return (
        <NavBar>
            <h1 className="text-4xl font-extrabold m-1 pl-2">{doc.name}</h1>
            <Label className="m-1 pl-2">Your Changes</Label>
            <div>
                <Button variant="secondary" className="ml-2" onClick={onClick}>
                    Back
                </Button>
                <Dialog>
                <DialogTrigger asChild>
                    <Button className="ml-2">New Change</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a New Edit</DialogTitle>
                    </DialogHeader>
                    <div className="mb-4">
                        <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700">
                            Edit Title
                        </label>
                        <input
                            type="text"
                            id="editTitle"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="chapterSelect" className="block text-sm font-medium text-gray-700">
                            Select Chapter
                        </label>
                        <select
                            id="chapterSelect"
                            value={selectedChapter}
                            onChange={(e) => setSelectedChapter(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                        >
                            {chapters.map((chapter, i) => (
                                chapter.sections.map((section, index) => (
                                    <option key={index} value={section.id}>{section.title}</option>
                                ))
                            ))}
                        </select>
                    </div>
                    <Button type="submit" className="ml-2" onClick={() => newEditHandler()}>
                        Create Edit
                    </Button>
                </DialogContent>
            </Dialog>
            </div>
            <div className="flex flex-col h-full mb-4 p-6">
                <div className="w-full">
                    {changes.map((change, index) => (
                        <div
                            key={index}
                            onClick={() => newEditHandler(change.cid)}
                            className="border-b-2 py-4"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">{change.title}</h2>
                            </div>
                            <div className="flex justify-between mt-2">
                                <div className="text-sm text-gray-600">
                                    Last Edited: {change.updatedAt}
                                </div>
                                {
                                    change.submit ? (
                                        <div className="text-sm text-gray-600">
                                            Submitted
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-600">
                                            Not Submitted
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </NavBar>
    );
}


export const getServerSideProps = async ({req, query}) => {
    const session = await authStytchRequest(req)
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
    const {name} = query
    const document = await prisma.Document.findFirst({
        where: {
            name: name
        }
    })
    const { chapters } = await getRepoTreeRecursive(document.owner, document.repo, getCookie('gho_token'))
    const changes = await prisma.Change.findMany({
        where: {
            suggestorId: session.userId,
            documentId: document.did
        }
    })
    console.log(changes)
    return {
        props: {
            doc: document,
            changes,
            chapters
        }
    }
}