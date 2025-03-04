"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CleaningBusiness {
  id: string
  name: string
  admin: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  website?: string
  teamMembers?: number
  operatingCity?: string
  services?: string[]
}

interface CleaningBusinessRequestModalProps {
  isOpen: boolean
  onClose: () => void
  business: CleaningBusiness
  onApprove: (id: string) => void
  onDecline: (id: string) => void
}

export function CleaningBusinessRequestModal({
  isOpen,
  onClose,
  business,
  onApprove,
  onDecline,
}: CleaningBusinessRequestModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Cleaning Business Request</h2>
          <div>
            <h3 className="text-sm font-medium mb-2">Business Information</h3>
            <p className="text-sm">
              <strong>Business Name:</strong> {business.name}
            </p>
            <p className="text-sm">
              <strong>Business Address:</strong> {business.address}
            </p>
            <p className="text-sm">
              <strong>Business City:</strong> {business.city}
            </p>
            <p className="text-sm">
              <strong>Business State:</strong> {business.state}
            </p>
            <p className="text-sm">
              <strong>Website:</strong> {business.website}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Primary Contact Details</h3>
            <p className="text-sm">
              <strong>Business Admin:</strong> {business.admin}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {business.email}
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> {business.phone}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Operating Information</h3>
            <p className="text-sm">
              <strong>Team Member:</strong> {business.teamMembers}
            </p>
            <p className="text-sm">
              <strong>Operating City:</strong> {business.operatingCity}
            </p>
            <p className="text-sm">
              <strong>Services:</strong>
            </p>
            <ul className="list-disc list-inside text-sm">
              {business.services?.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onDecline(business.id)}>
              Decline
            </Button>
            <Button onClick={() => onApprove(business.id)}>Approve</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

