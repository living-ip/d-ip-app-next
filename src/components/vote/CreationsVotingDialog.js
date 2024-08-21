'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XIcon, HeartIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Sample art proposals data with longer descriptions
const artProposals = [
  {
    id: 1,
    title: "Neon Cityscape",
    description: "A vibrant, futuristic cityscape with neon lights and flying cars. The artwork captures the essence of a bustling metropolis in the year 2150, where towering skyscrapers reach into the clouds and holographic advertisements illuminate the night sky. Sleek vehicles zoom between buildings, showcasing advanced transportation systems. The piece explores themes of technological progress, urban development, and the blending of natural and artificial light in future cityscapes.",
    image: "/placeholder.svg?height=400&width=600"
  },
  {
    id: 2,
    title: "Serene Forest",
    description: "A peaceful forest scene with sunlight filtering through the trees. This artwork transports viewers to a lush, ancient woodland untouched by human influence. Rays of golden sunlight pierce through the dense canopy, creating a magical interplay of light and shadow on the forest floor. The piece captures the intricate details of moss-covered rocks, delicate ferns, and the rich textures of tree bark. It invites contemplation on the beauty of nature and the importance of preserving our planet's ecosystems.",
    image: "/placeholder.svg?height=400&width=600"
  },
  {
    id: 3,
    title: "Abstract Emotions",
    description: "An abstract representation of human emotions using bold colors and shapes. This piece delves into the complex world of human feelings, using a vibrant palette and dynamic forms to evoke various emotional states. Swirling patterns in warm reds and oranges might represent passion or anger, while cool blues and greens could signify calmness or melancholy. The artwork challenges viewers to explore their own emotional landscapes and consider how colors and shapes can convey feelings beyond words.",
    image: "/placeholder.svg?height=400&width=600"
  },
]

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

const ExplanationScreen = ({ onBegin }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={variants}
    className="text-center py-4"
  >
    <h3 className="text-lg font-semibold mb-4">Welcome to the Future Art Challenge!</h3>
    <p className="text-sm text-muted-foreground mb-6">
      In this competition, artists from around the world have submitted their visions of the future.
      Your task is to review each piece and vote for the ones that resonate with you the most.
      Your choices will help determine the finalists for our grand exhibition.
    </p>
    <Button onClick={onBegin}>Begin Voting</Button>
  </motion.div>
);

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + '...';
};

export default function CreationsVotingDialog({ children }) {
  const [currentProposal, setCurrentProposal] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [matches, setMatches] = useState([])
  const [hasStartedVoting, setHasStartedVoting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const paginate = (newDirection) => {
    if (currentProposal + newDirection >= 0 && currentProposal + newDirection < artProposals.length) {
      setCurrentProposal(currentProposal + newDirection)
      setIsExpanded(false) // Reset expanded state when changing proposals
    } else {
      setCurrentProposal(artProposals.length) // Move to summary
    }
  }

  const handleAccept = () => {
    setMatches([...matches, artProposals[currentProposal].id])
    paginate(1)
  }

  const handleReject = () => {
    paginate(1)
  }

  const handleBeginVoting = () => {
    setHasStartedVoting(true)
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
    setHasStartedVoting(false)
    setCurrentProposal(0)
    setMatches([])
    setIsExpanded(false)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Future Art Challenge</DialogTitle>
          <DialogDescription>
            Explore and vote on futuristic art proposals.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full"> {/* Added w-full */}
          <AnimatePresence mode="wait">
            {!hasStartedVoting ? (
              <ExplanationScreen key="explanation" onBegin={handleBeginVoting} />
            ) : currentProposal < artProposals.length ? (
              <motion.div
                key={currentProposal}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full" // Added w-full
              >
                <Card className="w-full"> {/* Added w-full */}
                  <CardContent className="p-0 w-full"> {/* Added w-full, removed padding */}
                    <img
                      src={artProposals[currentProposal].image}
                      alt={artProposals[currentProposal].title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4 w-full"> {/* Added w-full */}
                      <h3 className="text-lg font-semibold mb-2">{artProposals[currentProposal].title}</h3>
                      <motion.div
                        initial={{ height: 'auto' }}
                        animate={{ height: isExpanded ? 'auto' : '4.5em' }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden w-full" // Added w-full
                      >
                        <p className="text-sm text-muted-foreground mb-2">
                          {isExpanded
                            ? artProposals[currentProposal].description
                            : truncateText(artProposals[currentProposal].description, 150)}
                        </p>
                      </motion.div>
                      {artProposals[currentProposal].description.length > 150 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleExpanded}
                          className="p-0 h-auto font-normal"
                        >
                          {isExpanded ? (
                            <>
                              Read less <ChevronUpIcon className="ml-1 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Read more <ChevronDownIcon className="ml-1 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}
                      <div className="flex justify-center space-x-4 mt-4 w-full"> {/* Added w-full */}
                        <Button variant="outline" size="icon" onClick={handleReject}>
                          <XIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleAccept}>
                          <HeartIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="summary"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full" // Added w-full
              >
                <div className="text-center py-4 w-full"> {/* Added w-full */}
                  <p className="text-lg font-semibold mb-2">Voting Complete!</p>
                  <p className="text-sm text-muted-foreground mb-4">You voted for {matches.length} art pieces.</p>
                  <p className="text-sm text-muted-foreground mb-4">Thank you for participating in the Future Art Challenge!</p>
                  <Button onClick={handleCloseDialog}>Close</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}