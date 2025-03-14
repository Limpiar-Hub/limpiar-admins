"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingRequestModal } from "@/components/booking/booking-request-modal"
import { BookingDetailsModal } from "@/components/booking/booking-details-modal"
import { AssignBusinessModal } from "@/components/booking/assign-business-modal"

interface Booking {
  id: string
  type: string
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

const bookings: Booking[] = [
  {
    id: "Hospital",
    type: "Hospital",
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
    ],
  },
  {
    id: "Warehouse",
    type: "Warehouse",
    propertyManager: {
      name: "Jane Smith",
    },
    property: "Horizon Heights",
    service: "Cleaning",
    amount: "$ 85.00",
    date: "12 June, 2025",
    time: "9:00 AM - 11:00 AM",
    additionalNote: "Regular cleaning service for the warehouse facility",
    status: "Pending",
    timeline: [
      {
        date: "Sunday, 12 June 2025",
        time: "10:15 am",
        event: "Booking requested by",
        user: {
          name: "Jane Smith",
        },
      },
    ],
  },
  {
    id: "Corporate",
    type: "Corporate",
    propertyManager: {
      name: "Michael Johnson",
    },
    property: "Prestige Park Place",
    service: "Office Cleaning",
    amount: "$ 150.00",
    date: "13 June, 2025",
    time: "6:00 PM - 9:00 PM",
    additionalNote: "After-hours cleaning service for corporate offices",
    status: "Pending",
    timeline: [
      {
        date: "Monday, 13 June 2025",
        time: "2:30 pm",
        event: "Booking requested by",
        user: {
          name: "Michael Johnson",
        },
      },
    ],
  },
  {
    id: "School",
    type: "School",
    propertyManager: {
      name: "Emily Davis",
    },
    property: "Premier Plaza",
    service: "Deep Cleaning",
    amount: "$ 200.00",
    date: "14 June, 2025",
    time: "8:00 AM - 4:00 PM",
    additionalNote: "Weekend deep cleaning for all classrooms and common areas",
    status: "Pending",
    timeline: [
      {
        date: "Tuesday, 14 June 2025",
        time: "9:45 am",
        event: "Booking requested by",
        user: {
          name: "Emily Davis",
        },
      },
    ],
  },
  {
    id: "Industrial",
    type: "Industrial",
    propertyManager: {
      name: "Robert Wilson",
    },
    property: "Downtown Dwell",
    service: "Industrial Cleaning",
    amount: "$ 300.00",
    date: "15 June, 2025",
    time: "7:00 AM - 3:00 PM",
    additionalNote: "Heavy-duty cleaning for industrial equipment and facilities",
    status: "Pending",
    timeline: [
      {
        date: "Wednesday, 15 June 2025",
        time: "11:20 am",
        event: "Booking requested by",
        user: {
          name: "Robert Wilson",
        },
      },
    ],
  },
  {
    id: "University",
    type: "University",
    propertyManager: {
      name: "Sarah Brown",
    },
    property: "Summit Square",
    service: "Campus Cleaning",
    amount: "$ 250.00",
    date: "16 June, 2025",
    time: "6:30 AM - 2:30 PM",
    additionalNote: "Comprehensive cleaning service for university campus buildings",
    status: "Pending",
    timeline: [
      {
        date: "Thursday, 16 June 2025",
        time: "10:05 am",
        event: "Booking requested by",
        user: {
          name: "Sarah Brown",
        },
      },
    ],
  },
]

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "inactive">("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [showAssignButton, setShowAssignButton] = useState(false)

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
    if (booking.status === "Pending") {
      setIsRequestModalOpen(true)
    } else {
      setIsDetailsModalOpen(true)
    }
  }

  const handleApproveBooking = () => {
    if (selectedBooking) {
      // Update booking status and add timeline event
      const updatedBooking = {
        ...selectedBooking,
        status: "Not Started" as const,
        timeline: [
          ...selectedBooking.timeline,
          {
            date: "Saturday, 11 June 2025",
            time: "11:50 am",
            event: "Booking request confirm by admin",
            user: {
              name: "Admin",
            },
          },
        ],
      }
      setSelectedBooking(updatedBooking)
      setShowAssignButton(true)
    }
  }

  const handleAssignClick = () => {
    setIsRequestModalOpen(false)
    setIsAssignModalOpen(true)
  }

  const handleAssignBusiness = (businessName: string) => {
    if (selectedBooking) {
      // Update booking with assigned business
      const updatedBooking = {
        ...selectedBooking,
        cleaningBusiness: businessName,
        status: "Active" as const,
        timeline: [
          ...selectedBooking.timeline,
          {
            date: "Saturday, 11 June 2025",
            time: "11:50 am",
            event: "Booking assigned to",
            assignedBusiness: businessName,
            user: {
              name: "Admin",
            },
          },
        ],
      }
      // Update bookings list
      setSelectedBooking(updatedBooking)
      setIsAssignModalOpen(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-800"
      case "On Hold":
        return "bg-purple-50 text-purple-800"
      case "Completed":
        return "bg-green-50 text-green-800"
      case "Failed":
        return "bg-red-50 text-red-800"
      case "Refund":
        return "bg-orange-50 text-orange-800"
      default:
        return "bg-gray-50 text-gray-800"
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
              <Button className="bg-[#0082ed] hover:bg-[#0082ed]/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Property Manager
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "pending"
                      ? "border-[#0082ed] text-[#0082ed]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("pending")}
                >
                  Pending (6)
                </button>
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "active"
                      ? "border-[#0082ed] text-[#0082ed]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("active")}
                >
                  Active (21)
                </button>
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "inactive"
                      ? "border-[#0082ed] text-[#0082ed]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("inactive")}
                >
                  Inactive (6)
                </button>
              </nav>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-8 py-4 px-6">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  {activeTab === "active" && (
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  )}
                  {activeTab === "pending" && <th className="py-3 px-4"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="py-5 px-6">
                      <input type="checkbox" className="rounded border-gray-300" onClick={(e) => e.stopPropagation()} />
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{booking.type}</span>
                        <span className="text-sm text-gray-500">{booking.property}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{booking.propertyManager.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{booking.cleaningBusiness || "-"}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{booking.service}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{booking.amount}</td>
                    {activeTab === "active" && (
                      <td className="py-5 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    )}
                    {activeTab === "pending" && (
                      <td className="py-4 px-4">
                        <button
                          className="text-[#0082ed] hover:underline text-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedBooking(booking)
                            setIsRequestModalOpen(true)
                          }}
                        >
                          Approve
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedBooking && (
        <>
          <BookingRequestModal
            isOpen={isRequestModalOpen}
            onClose={() => {
              setIsRequestModalOpen(false)
              setShowAssignButton(false)
            }}
            booking={selectedBooking}
            onApprove={handleApproveBooking}
            onDecline={() => setIsRequestModalOpen(false)}
            showAssignButton={showAssignButton}
            onAssign={handleAssignClick}
          />
          <BookingDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            booking={selectedBooking}
          />
          <AssignBusinessModal
            isOpen={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
            onAssign={handleAssignBusiness}
          />
        </>
      )}
    </div>
  )
}

