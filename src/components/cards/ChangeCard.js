import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChangeResultBadge } from "@/components/badge/ChangeResultBadge"
import { useStore } from "@/lib/store"
import VoteTimeRemainingBadge from "@/components/badge/VoteTimeRemainingBadge"
import { Badge } from "@/components/ui/badge"

export function ChangeCard({ change, onClick }) {
  const [userProfile] = useStore((state) => [state.userProfile])

  const parseChangeName = (name) => {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const UserItem = ({ src, text }) => (
    <div className="flex items-center gap-2">
      <Avatar className="w-6 h-6">
        <AvatarImage src={src} alt={text} />
        <AvatarFallback>{text.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-neutral-950 truncate">{text}</span>
    </div>
  )

  return (
    <Card
      className="w-full bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => {onClick(change)}}
    >
      <CardHeader className="pb-2">
        <h2 className="text-lg font-semibold text-neutral-950 truncate">
          {parseChangeName(change.name)}
        </h2>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-600 line-clamp-2">{change.description}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between items-center pt-2">
        {!change.closed && !change.merged ? (
          <>
            <div className="flex items-center gap-2">
              <VoteTimeRemainingBadge change={change} />
              <Badge variant="secondary" className="text-xs font-medium">
                {change.votes.count} votes
              </Badge>
            </div>
            {change.creator_id === userProfile.uid && (
              <UserItem src={change.creator.image_uri} text="Your Change" />
            )}
          </>
        ) : (
          <>
            <UserItem src={change.creator.image_uri} text={change.creator.name} />
            <ChangeResultBadge change={change} />
          </>
        )}
      </CardFooter>
    </Card>
  )
}
