'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Mock data for the listings
const initialListings = [
  { id: 1, title: "Cozy Apartment", description: "A comfortable apartment in the city center", details: "This lovely apartment features 2 bedrooms, a fully equipped kitchen, and a spacious living room. Located in the heart of the city, it's perfect for both short and long-term stays." },
  { id: 2, title: "Luxury Villa", description: "Stunning villa with ocean view", details: "Experience luxury living in this magnificent villa. With 5 bedrooms, a private pool, and breathtaking ocean views, it's the perfect getaway for those seeking the ultimate in comfort and style." },
  { id: 3, title: "Rustic Cabin", description: "Peaceful retreat in the woods", details: "Escape the hustle and bustle of city life in this charming rustic cabin. Surrounded by nature, it offers 2 bedrooms, a cozy fireplace, and a large deck perfect for stargazing." },
  { id: 4, title: "Modern Loft", description: "Sleek loft in the arts district", details: "This modern loft boasts high ceilings, large windows, and an open floor plan. Located in the vibrant arts district, it's ideal for creatives and professionals alike." },
  { id: 5, title: "Beachfront Condo", description: "Wake up to the sound of waves", details: "Start your day with stunning ocean views in this beachfront condo. Featuring 3 bedrooms, a fully equipped kitchen, and direct beach access, it's the perfect seaside retreat." },
]

export function CampaignLayout() {
  const [listings, setListings] = useState(initialListings)
  const [selectedListing, setSelectedListing] = useState(listings[0])
  const [isCreating, setIsCreating] = useState(false)
  const [newListing, setNewListing] = useState({ title: '', description: '', details: '' })

  const handleCreateNew = () => {
    setIsCreating(true)
    setSelectedListing(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const id = listings.length + 1
    const createdListing = { id, ...newListing }
    setListings([...listings, createdListing])
    setSelectedListing(createdListing)
    setIsCreating(false)
    setNewListing({ title: '', description: '', details: '' })
  }

  return (
    <div className="flex h-full bg-background">
      {/* Left column: Create button and scrollable list of cards */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-2">
          <Button className="w-full" onClick={handleCreateNew}>Create New Listing</Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                className={`w-full cursor-pointer transition-colors hover:bg-accent ${selectedListing?.id === listing.id ? 'bg-accent' : ''}`}
                onClick={() => {
                  setSelectedListing(listing)
                  setIsCreating(false)
                }}>
                <CardHeader>
                  <CardTitle>{listing.title}</CardTitle>
                  <CardDescription>{listing.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
      {/* Right column: Selected listing details or Create form */}
      <div className="flex-1 p-6 overflow-auto">
        {isCreating ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Create New Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newListing.title}
                    onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                    required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newListing.description}
                    onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                    required />
                </div>
                <div>
                  <Label htmlFor="details">Details</Label>
                  <Textarea
                    id="details"
                    value={newListing.details}
                    onChange={(e) => setNewListing({...newListing, details: e.target.value})}
                    required />
                </div>
                <Button type="submit" className="w-full">Create Listing</Button>
              </form>
            </CardContent>
          </Card>
        ) : selectedListing && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">{selectedListing.title}</CardTitle>
              <CardDescription>{selectedListing.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{selectedListing.details}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}