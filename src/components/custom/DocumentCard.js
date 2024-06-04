export function DocumentCard({ name, description, lastEditDate, onClick }) {
  return (
    <div onClick={onClick} className="flex flex-col p-4 mt-3 bg-white rounded-xl border border-gray-200 border-solid max-md:max-w-full cursor-pointer">
      <h3 className="text-lg font-medium leading-7 text-neutral-950 max-md:max-w-full">{name}</h3>
      <p className="mt-2 leading-5 text-neutral-600 max-md:max-w-full">{description}</p>
      <time className="mt-2 leading-[143%] text-zinc-500 max-md:max-w-full">
        Last edit {new Date(lastEditDate).toLocaleString()}
      </time>
    </div>
  );
}