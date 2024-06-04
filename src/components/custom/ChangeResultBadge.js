export function ChangeResultBadge({ change }) {
  return change.closed ? (
    <div className="flex justify-center items-center h-fit px-2 py-0.5 rounded-full text-xs bg-red-200 text-red-600">
      Rejected
    </div>
  ) : (
    <div className="flex justify-center items-center h-fit px-2 py-0.5 rounded-full text-xs bg-green-200 text-green-600">
      Approved
    </div>
  );
}