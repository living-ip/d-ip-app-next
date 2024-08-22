'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XIcon, HeartIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

export default function CreationsVotingDialog({ children, campaigns }) {
  console.log(campaigns)
  const [currentProposal, setCurrentProposal] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [matches, setMatches] = useState([])
  const [hasStartedVoting, setHasStartedVoting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const paginate = (newDirection) => {
    if (currentProposal + newDirection >= 0 && currentProposal + newDirection < campaigns.length) {
      setCurrentProposal(currentProposal + newDirection)
      setIsExpanded(false) // Reset expanded state when changing proposals
    } else {
      setCurrentProposal(campaigns.length) // Move to summary
    }
  }

  const handleAccept = () => {
    setMatches([...matches, campaigns[currentProposal].id])
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
            ) : currentProposal < campaigns.length ? (
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
                      src={campaigns[currentProposal].image}
                      alt={campaigns[currentProposal].title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4 w-full"> {/* Added w-full */}
                      <h3 className="text-lg font-semibold mb-2">{campaigns[currentProposal].title}</h3>
                      <motion.div
                        initial={{ height: 'auto' }}
                        animate={{ height: isExpanded ? 'auto' : '4.5em' }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden w-full" // Added w-full
                      >
                        <p className="text-sm text-muted-foreground mb-2">
                          {isExpanded
                            ? campaigns[currentProposal].description
                            : truncateText(campaigns[currentProposal].description, 150)}
                        </p>
                      </motion.div>
                      {campaigns[currentProposal].description.length > 150 && (
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