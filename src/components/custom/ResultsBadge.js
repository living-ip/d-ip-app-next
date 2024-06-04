export function ResultsBadge({change}) {
	let status = "";
	let css = "";

	if (change.closed) {
		status = "Not Passed";
		css = "bg-neutral-300 text-pink-950";
	} else {
		status = "Passed";
		css = "bg-[#7C9E66] text-lime-950";
	}

	return (
		<section className={"justify-center px-2 py-0.5 my-auto text-xs font-medium rounded-[100px] " + css}>
			{status}
		</section>
	)
}