export default function UserCarousel({ users }) {
  return (
    <div className="flex space-x-4 overflow-x-scroll">
      {users.map((user, index) => (
        <div key={index} className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
          {/* Replace `user.image` with the correct property to display the user's image */}
          <img src={user.image} alt={user.name} className="w-14 h-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}
