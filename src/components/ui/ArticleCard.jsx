export default function ArticleCard({ description }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p>{description}</p>
    </div>
  );
}
