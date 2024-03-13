import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import ReadingPane from "@/components/doc/ReadingPane";
import UserCarousel from "@/components/ui/UserCarousel";
import prisma from "@/lib/server/prisma";
import {useState} from "react";
import ChapterCard from "@/components/doc/ChapterCard";
import {authStytchRequest} from "@/lib/stytch";
import {getRepoTreeRecursive} from "@/lib/server/github";
import {Layout} from "@/components/ui/layout";
import Image from "next/image";

export default function Index({
                                collection,
                                document,
                                contributors,
                                chapters,
                                firstPage,
                              }) {
  const router = useRouter();
  const [showChapters, setShowChapters] = useState(false);
  const [pageContent, setPageContent] = useState(firstPage);

  const goToVotes = () => {
    router.push(
      `/collections/${encodeURI(collection.name)}/document/${document.did}/vote`
    );
  };

  const toggleChapters = () => {
    setShowChapters(!showChapters);
  };

  const goToEdits = () => {
    router.push(
      `/collections/${encodeURI(collection.name)}/document/${document.did}/edit`
    );
  };

  return (
    <Layout>
      <div className="flex">
        <div className="mt-4 w-1/3">
          <div className="flex items-center">
            <Image
              src={document.image_uri}
              alt={"livingIP"}
              width={100}
              height={100}
              objectFit="cover"
              objectPosition="center"
              className="mr-4 rounded-lg"
            />
            <div className="text-4xl font-extrabold ">{document.name}</div>
          </div>
          <div className="p-1 mt-2 text-sm italic text-gray-600">
            {document.description}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div className="flex">
              <Button variant="outline" className="mr-4" onClick={goToVotes}>
                Votes
              </Button>
              <Button variant="outline" onClick={goToEdits}>
                Edit
              </Button>
            </div>
            <Button className="mr-4" onClick={toggleChapters}>
              Chapters
            </Button>
          </div>
          <div className="text-2xl font-bold pt-4">Contributors</div>
          <div className="mx-2 mb-4">
            <UserCarousel users={contributors}/>
          </div>
        </div>
        <div className="flex-1 max-h-screen p-4 ml-2 border-l">
          {showChapters ? (
            <div>
              {chapters.map((chapter, index) => {
                return (
                  <ChapterCard
                    key={index}
                    chapter={chapter}
                    setContent={setPageContent}
                    showChapters={setShowChapters}
                  />
                );
              })}
            </div>
          ) : (
            <div className="h-full p-4 overflow-y-scroll rounded-lg bg-gray-50">
              <ReadingPane content={pageContent}/>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({req, query}) => {
  const {session} = await authStytchRequest(req);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const {name, documentId} = query;

  const collection = await prisma.Collection.findFirst({
    where: {
      name: name,
    },
  });
  console.log("Collection: ", collection);

  const document = await prisma.Document.findFirst({
    where: {
      did: documentId,
    },
  });
  console.log("Document: ", document);

  const {chapters, firstPage} = await getRepoTreeRecursive(
    document.owner,
    document.repo
  );

  const changes = await prisma.Change.findMany({
    where: {
      document: {
        did: document.did,
      },
      published: true,
      merged: true,
    },
    include: {
      suggestor: true,
    },
  });
  console.log("Changes: ", changes)
  const proposers = (changes || []).map((change) => change.suggestor?.name);
  console.log("Proposers: ", proposers)
  const contributors = [...new Set([document.owner, ...proposers])];
  console.log("Contributors: ", contributors);

  return {
    props: {
      collection,
      document,
      contributors,
      chapters,
      firstPage,
    },
  };
};
