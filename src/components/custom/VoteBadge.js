export function VoteBadge({change}) {

	let status = "";
	let css = "";
	if (!change.closed && !change.merged) {
		status = "Voting ongoing";
		css = " bg-[#E8ECE6] text-neutral-950";
	} else if (change.closed) {
		status = "Vote not passed";
		css = "bg-[#E9C9C9] text-red-700";
	} else {
		status = "Vote passed";
		css = "bg-[#D9E3D3] text-green-600";
	}

	return (
		<section className={"justify-center px-3 py-0.5 text-sm font-medium " + css}>
			{status}
		</section>
	)
}