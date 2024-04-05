import {
  Card,
  CardDescription,
  CardHeader,
  CardImage,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { authStytchRequest } from "@/lib/stytch";
import { getUserProfile } from "@/lib/user";
import { Layout } from "@/components/ui/layout";
import prisma from "@/lib/server/prisma";
import { approveDocument } from "@/lib/app/document";
import { convertNameToGithubRepo } from "@/lib/utils";

const DocCards = ({ collection, docs, adminUser }) => {
  const router = useRouter();

  return (
    <Layout>
      <div className="my-10 flex justify-between items-center w-full">
        <div className="flex flex-col mr-4 w-full">
          <div className={"flex mb-4 justify-between items-center w-full"}>
            <div className={"text-4xl font-extrabold"}>{collection.name}</div>
            <Button
              onClick={() =>
                router.push(`/collections/${encodeURI(collection.name)}/new`)
              }
            >
              Request New Document Creation
            </Button>
          </div>
          <div className={"text-lg"}>{collection.description}</div>
        </div>
      </div>
      <div className="flex flex-col w-full overflow-auto mb-16">
        <div className="flex flex-wrap -mx-2">
          {docs.map((doc, index) => {
            const cardStyle = doc.draft ? "bg-gray-200 no-shadow" : ""; // replace "bg-gray-200" with your draft style, "no-shadow" is a placeholder for the style without shadow
            const titleStyle = doc.draft ? "text-gray-500 italic" : ""; // replace "text-gray-500" with your gray color style
            const imageStyle = doc.draft ? "blur-sm" : ""; // replace "filter grayscale" with your grayscale style
            const docName = doc.draft ? "Document Under Review" : doc.name;
            const docDescription = doc.draft
              ? "This document is currently under review by the community. Please check back later."
              : doc.description;
            return (
              <div
                key={index}
                className={`w-full sm:w-1 md:w-1/2 lg:w-1/2 xl:w-1/3 px-2 mb-8`}
              >
                <Card className={cardStyle}>
                  <CardHeader>
                    <CardTitle className={titleStyle}>{docName}</CardTitle>
                    {adminUser && doc.draft ? (
                      <div className="text-sm text-gray-500">
                        Name of repo to be created:{" "}
                        {convertNameToGithubRepo(doc.name)}
                      </div>
                    ) : null}
                    <CardImage
                      className={`w-full h-[240px] rounded-lg ${imageStyle}`}
                      src={doc.image_uri}
                    />
                    <div className="flex flex-col justify-between h-full">
                      <CardDescription>{docDescription}</CardDescription>
                      <div className="flex justify-between mt-auto">
                        {doc.draft ? (
                          adminUser ? (
                            <Button
                              onClick={() => {
                                approveDocument(collection.coid, doc.did).then(
                                  (r) =>
                                    router.push(
                                      `/collections/${encodeURI(
                                        collection.name
                                      )}`
                                    )
                                );
                              }}
                            >
                              Approve Draft
                            </Button>
                          ) : null
                        ) : (
                          <>
                            <Button
                              onClick={() =>
                                router.push(
                                  `/collections/${encodeURI(
                                    collection.name
                                  )}/document/${doc.did}`
                                )
                              }
                            >
                              Read it
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() =>
                                router.push(
                                  `/collections/${encodeURI(
                                    collection.name
                                  )}/document/${doc.did}/vote`
                                )
                              }
                            >
                              See votes
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default DocCards;

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
  const sessionJWT = req.cookies["stytch_session_jwt"];
  const { userProfile } = await getUserProfile(session.user_id, sessionJWT);
  if (!userProfile) {
    return {
      redirect: {
        destination: "/onboard",
        permanent: false,
      },
    };
  }

  const { name } = query;
  const collection = await prisma.Collection.findFirst({
    where: {
      name: name,
    },
  });
  console.log("Collection: ", collection);

  const docs = await prisma.Document.findMany({
    where: {
      collectionId: collection.coid,
    },
  });
  console.log("Documents: ", docs);

  let adminUser = false;
  if (session.user_id === "user-test-af0ae6be-d4cb-400c-8ba1-31be8876d8db") {
    adminUser = true;
  }

  return {
    props: {
      collection,
      docs,
      adminUser,
    },
  };
};
