import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import {useStore} from "@/lib/store";


export function WantMoreComponent({project, content}) {
	const router = useRouter();
  const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) =>
    [state.userRoles, state.setInvalidPermissionsDialogOpen]
  );

	return (
		<div
			className="flex flex-col justify-center items-center self-stretch p-8 w-full rounded-xl bg-neutral-100 text-neutral-950 max-md:px-5 max-md:mt-8">
			<h2 className="text-2xl leading-8 text-center">{content.title}</h2>
			<p className="self-stretch mt-2 text-sm leading-5 text-center text-neutral-600">
				{content.description}
			</p>
			{/*TODO: Ben fix permissions and modal on button click*/}
			<Button
				className="justify-center px-3 py-2 mt-4 font-medium leading-6 rounded text-neutral-950 bg-[#E1E5DE]"
				onClick={() => {
					if (!userRoles.find((role) => role.project === project.pid && role.role.create_document)) {
						setInvalidPermissionsDialogOpen(true);
						return;
					}
					router.push(content.buttonLink);
				}}
			>
				{content.buttonText}
			</Button>
		</div>
	)
}