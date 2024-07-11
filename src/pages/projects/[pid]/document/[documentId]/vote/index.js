import {useRouter} from "next/router";
import {authStytchRequest} from "@/lib/stytch";
import {getProject} from "@/lib/project";
import {getDocument, getDocumentChanges} from "@/lib/document";
import {getChangeVotes} from "@/lib/change";
import {NewLayout} from "@/components/NewLayout";
import {ChangeCard} from "@/components/custom/ChangeCard";
import {initializeStore} from "@/lib/store";
import {getUserProfile} from "@/lib/user";
import ReadingPane from "@/components/doc/ReadingPane";
import {Button} from "@/components/ui/button";
import {IoArrowBackOutline} from "react-icons/io5";

export default function Index({project, document, changesWithVotes}) {
    const router = useRouter();

    const renderChangeCards = (changes) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {changes.map((change, index) => (
          <ChangeCard
            key={index}
            change={change}
            onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/vote/${change.cid}`)}
          />
        ))}
      </div>
    );

    const ongoingChanges = changesWithVotes.filter(change => !change.closed && !change.merged);
    const completedChanges = changesWithVotes.filter(change => change.closed || change.merged);

    return (
       <NewLayout>
          <div
             className="flex flex-col self-center px-20 py-8 w-full bg-white h-screen border rounded-3xl max-md:px-5 max-md:max-w-full">
             <section className="flex flex-row max-md:flex-col gap-3 justify-between max-md:justify-center w-full">
                <div className="flex flex-col w-[73%] max-md:max-w-full">
                   <div className="flex gap-3 max-md:flex-wrap">
                      <Button variant="outline" className="p-2.5 rounded-sm border border-gray-200 border-solid">
                         <IoArrowBackOutline className="w-4 h-4 cursor-pointer" onClick={() => router.back()}/>
                      </Button>
                      <div className="text-3xl leading-9 text-neutral-950 max-md:max-w-full">{document.name}</div>
                   </div>
                   <div className="mt-3 text-base leading-6 text-neutral-600 max-md:max-w-full">
                      {document.description}
                   </div>
                   {/*TODO: Ben - update with last edit when served from the backend*/}
                   {/*<div className="mt-2 text-sm leading-5 text-zinc-500 max-md:max-w-full">{document.lastEdit}</div>*/}
                </div>
             </section>
             <section className="mt-3 max-md:max-w-full py-4">
                <h2 className="text-xl text-neutral-950 py-2">Ongoing</h2>
                {ongoingChanges.length > 0 ? (
                  renderChangeCards(ongoingChanges)
                ) : (
                  <div className="p-4 justify-between items-center">
                    No ongoing changes
                  </div>
                )}
             </section>

             <section className="mt-3 max-md:max-w-full py-4">
                <h2 className="text-xl text-neutral-950 py-2">Completed</h2>
                {completedChanges.length > 0 ? (
                  renderChangeCards(completedChanges)
                ) : (
                  <div className="p-4 justify-between items-center">
                    No completed changes
                  </div>
                )}
             </section>
          </div>
       </NewLayout>
    );
}

export const getServerSideProps = async ({
	                                         req, query
                                         }) => {
	const {session} = await authStytchRequest(req);
	if (!session) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	const {pid, documentId} = query

	const sessionJWT = req.cookies["stytch_session_jwt"];

	const {userProfile, roles} = await getUserProfile(session.user_id, sessionJWT);
	if (!userProfile) {
		return {
			redirect: {
				destination: "/onboard",
				permanent: false,
			},
		};
	}

	const [project, document] = await Promise.all([
		getProject(pid, sessionJWT),
		getDocument(documentId, sessionJWT)
	]);
	if (!project || !document) {
		return {
			redirect: {
				destination: `/projects`,
				permanent: false,
			},
		};
	}

	const publishedChanges = await getDocumentChanges(documentId, {"published": true}, sessionJWT);

	const changesWithVotes = await Promise.all(
		publishedChanges.map((change) =>
			getChangeVotes(change.cid, {}, sessionJWT).then(votes => ({
				...change,
				votes,
			}))
		)
	);

	const zustandServerStore = initializeStore({
		userProfile,
		userRoles: roles,
		currentProject: pid,
	});

	return {
		props: {
			project: project,
			document: document,
			changesWithVotes: changesWithVotes,
			initialZustandState: JSON.parse(
				JSON.stringify(zustandServerStore.getState())
			),
		},
	};
};
