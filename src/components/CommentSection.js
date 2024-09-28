import { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from '@/lib/store'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { addDocumentComment, getCommentUsers } from "@/lib/document"
import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core'

function getInitials(name) {
  if (!name) {
    return 'LIP'
  }
  let parts = name.split(' ')
  let initials = parts[0][0]
  if (parts.length > 1) {
    initials += parts[1][0]
  }
  return initials.toUpperCase()
}

function Comment({ name, content, imageUri }) {
    const initials = getInitials(name)
    console.log(imageUri)
    return (
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar>
            {imageUri ? (
              <AvatarImage src={imageUri} alt={name} />
            ) : (<>
              <AvatarImage src={`https://ui-avatars.com/api/?background=random?name=${name}`} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
              </>
            )}
          </Avatar>
          <div>
            <h4 className="text-sm font-semibold">{name}</h4>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm">{content}</p>
        </CardContent>
      </Card>
    )
  }

export default function CommentSection({ document }) {
  const { isAuthenticated } = useDynamicContext()
  const [userProfile] = useStore((state) => [state.userProfile]);
  const [comments, setComments] = useState(document.comments || [])
  const [commentUsers, setCommentUsers] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCommentUsers = async () => {
      try {
        const users = await getCommentUsers(document.did)
        setCommentUsers(users)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching comment users:", error)
        setIsLoading(false)
      }
    }

    fetchCommentUsers()
  }, [document.did])

  const handleAddComment = useCallback(async () => {
    if (!isAuthenticated || !newComment.trim()) {
      return
    }
    const comment = {
      did: document.did,
      content: newComment,
      user_id: userProfile.user_id
    }
    try {
      const addedComment = await addDocumentComment(document.did, comment, getAuthToken())
      setComments(prevComments => [...prevComments, addedComment])
      setNewComment('')

      // Fetch updated comment users
      const updatedUsers = await getCommentUsers(document.did)
      setCommentUsers(updatedUsers)
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }, [isAuthenticated, newComment, document.did])

  if (isLoading) {
    return <div>Loading comments...</div>
  }

  return (
    <div className="flex flex-col text-neutral-950">
      <h2 className="text-xl mb-4">Comments</h2>
      <div className="space-y-4">
        {comments?.map((comment, index) => (
          <Comment 
            key={index} 
            name={commentUsers[comment.user_id]?.name || 'Unkown User'}
            content={comment.content}
            imageUri={commentUsers[comment.user_id]?.image_uri}
        />
        ))}
      </div>
      {isAuthenticated && (
        <div className="mt-4">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button className="mt-2 w-full" onClick={handleAddComment} disabled={!isAuthenticated}>
            Add Comment
          </Button>
        </div>
      )}
    </div>
  )
}