"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface User {
  _id: string
  fullName: string
  email: string
  phoneNumber: string
  role: "property_manager" | "cleaning_business" | "limpiador"
  isVerified: boolean
  availability: boolean
  createdAt: string
  updatedAt: string
}

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onUpdate: (userId: string, updatedData: Partial<User>) => void
}

export function UserDetailsModal({ isOpen, onClose, user, onUpdate }: UserDetailsModalProps) {
  const [editedUser, setEditedUser] = useState(user)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(user._id, editedUser)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" value={editedUser.fullName} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={editedUser.email} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" name="phoneNumber" value={editedUser.phoneNumber} onChange={handleInputChange} />
          </div>
          <div>
            <Label>Role</Label>
            <Input value={editedUser.role} disabled />
          </div>
          <div>
            <Label>Verification Status</Label>
            <Input value={editedUser.isVerified ? "Verified" : "Pending"} disabled />
          </div>
          <div>
            <Label>Availability</Label>
            <Input value={editedUser.availability ? "Available" : "Unavailable"} disabled />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

