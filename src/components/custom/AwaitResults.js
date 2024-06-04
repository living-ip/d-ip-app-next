import Image from "next/image";

export function AwaitResults() {
	return (
		<div className="flex flex-col px-12 py-10 mt-4 leading-5 text-center text-neutral-600 max-md:px-5">
			{/*TODO: Update with correct image*/}
			<Image
				src="/living-ip.png"
				alt="" className="self-center w-8 shadow-md aspect-square"
				width="64" height="64"
			/>
			<p className="mt-2.5">Results become visible after casting period has ended.</p>
		</div>
	);
}