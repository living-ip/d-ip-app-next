import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { addDocumentComment } from "@/lib/document"
import { useStore } from "@/lib/store"
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

function Comment({ name, content }) {
  const initials = getInitials(name)
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
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

export default function CommentSection({ documentComments, documentId }) {
  const [userProfile] = useStore((state) => [state.userProfile])
  const { isAuthenticated } = useDynamicContext()
  const [comments, setComments] = useState(documentComments || [])
  const [newComment, setNewComment] = useState('')

  const handleAddComment = useCallback(() => {
    if (!isAuthenticated || !newComment.trim()) {
      return
    }
    
    const comment = {
      did: documentId,
      content: newComment
    }
    setComments(prevComments => [...prevComments, comment])
    addDocumentComment(documentId, comment, getAuthToken())
    setNewComment('')
  }, [isAuthenticated, newComment, documentId])

  return (
    <div className="flex flex-col text-neutral-950">
      <h2 className="text-xl mb-4">Comments</h2>
      <div className="space-y-4">
        {comments?.map((comment, index) => (
          <Comment key={index} name={userProfile.name || userProfile.email} {...comment} />
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