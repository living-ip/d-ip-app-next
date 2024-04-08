import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/server/user";
import {Card, CardContent, CardDescription, CardHeader, CardImage, CardTitle,} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Layout} from "@/components/ui/layout";
import {useRouter} from "next/router";
import prisma from "@/lib/server/prisma";

export default function Collections({collections}) {
	const router = useRouter();

	const desiredOrder = [
		"Claynosaurz",
		"Renaissance Hackathon Demo",
		"Build Republic",
		"LivingIP",
		"LivingIP Product"
	];

	const sortedCollections = [...collections].sort((a, b) => {
		const indexA = desiredOrder.indexOf(a.name);
		const indexB = desiredOrder.indexOf(b.name);

		if (indexA === -1 && indexB === -1) {
			return 0;
		} else if (indexA === -1) {
			return 1;
		} else if (indexB === -1) {
			return -1;
		} else {
			return indexA - indexB;
		}
	});

	return (
		<Layout>
			<div className="my-10 flex justify-between items-center w-full">
				<div className={"text-4xl font-extrabold"}>Collections</div>
				<Button onClick={() => router.push(`/collections/new`)}>
					Create a New Collection
				</Button>
			</div>
			<div className="flex flex-col w-full overflow-auto mb-8">
				{sortedCollections.map((collection, index) => (
					<div key={index} className={"w-full my-8"}>
						<Card className={"flex-grow w-full"}>
							<CardHeader className={"p-0 w-full"}>
								<CardImage
									className={"w-full h-auto max-h-[480px] rounded-t-lg"}
									src={collection.image_uri}
								/>
							</CardHeader>
							<CardContent className={"mt-4"}>
								<CardTitle className={"mb-2"}>{collection.name}</CardTitle>
								<CardDescription className={"py-2"}>
									{collection.description}
								</CardDescription>
								<Button
									className={"my-2"}
									onClick={() =>
										router.push(
											`/collections/${encodeURIComponent(collection.name)}`
										)
									}
								>
									Learn More
								</Button>
							</CardContent>
						</Card>
					</div>
				))}
			</div>
		</Layout>
	);
}

export const getServerSideProps = async ({req}) => {
	const {session} = await authStytchRequest(req);
	if (!session) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}
	const {userProfile} = await getUserProfile(session.user_id);
	if (!userProfile) {
		return {
			redirect: {
				destination: "/onboard",
				permanent: false,
			},
		};
	}

	const collections = await prisma.Collection.findMany();
	console.log("Collections: ", collections);

	return {
		props: {
			collections,
		},
	};
};
