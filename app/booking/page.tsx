"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Search, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingDetailsModal } from "@/components/booking-details-modal"
import { AssignBusinessModal } from "@/components/assign-business-modal"

interface Booking {
  id: string
  propertyManager: {
    name: string
    avatar?: string
  }
  property: string
  cleaningBusiness?: string
  service: string
  amount: string
  date: string
  time: string
  additionalNote: string
  status: "Pending" | "On Hold" | "Completed" | "Failed" | "Refund" | "Not Started"
  timeline: Array<{
    date: string
    time: string
    event: string
    user: {
      name: string
      avatar?: string
    }
    assignedBusiness?: string
  }>
}

const cleaningBusinesses = [
  { id: "1", name: "Binford Ltd." },
  { id: "2", name: "Happy Cleaners LLC." },
  { id: "3", name: "Abstergo Ltd." },
  { id: "4", name: "Acme Co." },
  { id: "5", name: "Biffco Enterprises Ltd." },
  { id: "6", name: "Ball Corporation" },
]

const bookings: Booking[] = [
  {
    id: "1",
    propertyManager: {
      name: "Jerome Bell",
    },
    property: "Elite Enclave",
    service: "Janitorial",
    amount: "$ 100.00",
    date: "11 June, 2025",
    time: "7:30 AM - 8:30 AM",
    additionalNote:
      "Physiological respiration involves the mechanisms that ensure that the composition of the functional",
    status: "Pending",
    timeline: [
      {
        date: "Saturday, 11 June 2025",
        time: "11:50 am",
        event: "Booking requested by",
        user: {
          name: "Jerome Bell",
        },
      },
      {
        date: "Saturday, 11 June 2025",
        time: "11:50 am",
        event: "Booking request confirm by admin",
        user: {
          name: "Admin",
        },
      },
    ],
  },
  // Add more bookings here...
]

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "inactive">("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailsModalOpen(true)
  }

  const handleApproveBooking = () => {
    // Implement booking approval logic
    setIsDetailsModalOpen(false)
  }

  const handleDeclineBooking = () => {
    // Implement booking decline logic
    setIsDetailsModalOpen(false)
  }

  const handleAssignBusiness = () => {
    setIsDetailsModalOpen(false)
    setIsAssignModalOpen(true)
  }

  const handleBusinessAssigned = (businessId: string) => {
    // Implement business assignment logic
    console.log(`Assigned business ${businessId} to booking ${selectedBooking?.id}`)
    setIsAssignModalOpen(false)
    // You might want to refresh the booking data here
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "On Hold":
        return "bg-purple-100 text-purple-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Failed":
      case "Refund":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-[240px]">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Booking</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 w-[240px] rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0082ed] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button className="bg-[#0082ed] hover:bg-[#0082ed]/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Booking
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {["pending", "active", "inactive"].map((tab) => (
                  <button
                    key={tab}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? "border-[#0082ed] text-[#0082ed]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab(tab as "pending" | "active" | "inactive")}
                  >
                    {`${tab.charAt(0).toUpperCase() + tab.slice(1)} (${
                      tab === "pending" ? 6 : tab === "active" ? 21 : 6
                    })`}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-8 py-3 px-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property Manager
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cleaning Business
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleBookingClick(booking)}
                  >
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{booking.id}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{booking.propertyManager.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{booking.cleaningBusiness || "-"}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{booking.service}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{booking.amount}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <div className="flex items-center">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                  className="ml-2 border-gray-300 rounded-md text-sm"
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                </select>
                <span className="ml-4 text-sm text-gray-700">
                  showing 1-{Math.min(rowsPerPage, bookings.length)} of {bookings.length} rows
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-700" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-700">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        booking={selectedBooking}
        onApprove={handleApproveBooking}
        onDecline={handleDeclineBooking}
        onAssignBusiness={handleAssignBusiness}
        mode={activeTab === "pending" ? "request" : "details"}
      />

      <AssignBusinessModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        businesses={cleaningBusinesses}
        onAssign={handleBusinessAssigned}
      />
    </div>
  )
}

