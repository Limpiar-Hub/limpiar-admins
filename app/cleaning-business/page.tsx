"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Search } from "lucide-react"
import { CleaningBusinessRequestModal } from "@/components/cleaning-business/cleaning-business-request-modal"
import { CleaningBusinessDetailsModal } from "@/components/cleaning-business/cleaning-business-details-modal"

interface CleaningBusiness {
  id: string
  name: string
  admin: string
  email: string
  phone: string
  amount?: string
  status: "pending" | "active"
}

const cleaningBusinesses: CleaningBusiness[] = [
  {
    id: "1",
    name: "Biffco Enterprises Ltd.",
    admin: "Darlene Robertson",
    email: "example@email.com",
    phone: "(406) 555-0120",
    amount: "$ 100.00",
    status: "active",
  },
  {
    id: "2",
    name: "Happy Cleaners LLC.",
    admin: "Annette Black",
    email: "example@email.com",
    phone: "(500) 555-0125",
    amount: "$ 250.00",
    status: "active",
  },
  {
    id: "3",
    name: "Binford Ltd.",
    admin: "Robert Fox",
    email: "example@email.com",
    phone: "(219) 555-0114",
    status: "pending",
  },
  // Add more businesses as needed
]

export default function CleaningBusinessPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "active">("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedBusiness, setSelectedBusiness] = useState<CleaningBusiness | null>(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const filteredBusinesses = cleaningBusinesses.filter(
    (business) =>
      business.status === activeTab &&
      (business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.admin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.phone.includes(searchQuery)),
  )

  const handleBusinessClick = (business: CleaningBusiness) => {
    setSelectedBusiness(business)
    if (business.status === "pending") {
      setIsRequestModalOpen(true)
    } else {
      setIsDetailsModalOpen(true)
    }
  }

  const handleApprove = (id: string) => {
    // Implement approval logic
    console.log(`Approving business ${id}`)
    setIsRequestModalOpen(false)
  }

  const handleDecline = (id: string) => {
    // Implement decline logic
    console.log(`Declining business ${id}`)
    setIsRequestModalOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-[240px]">
        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Cleaning Business</h1>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-1">
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === "pending"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("pending")}
              >
                Pending (6)
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === "active"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("active")}
              >
                Active (600)
              </button>
            </div>
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
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-8 py-3 px-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Admin
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  {activeTab === "active" && (
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  )}
                  {activeTab === "pending" && <th className="py-3 px-4"></th>}
                </tr>
              </thead>
              <tbody>
                {filteredBusinesses.map((business) => (
                  <tr
                    key={business.id}
                    className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleBusinessClick(business)}
                  >
                    <td className="py-4 px-4">
                      <input type="checkbox" className="rounded border-gray-300" onClick={(e) => e.stopPropagation()} />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{business.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{business.admin}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{business.email}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{business.phone}</td>
                    {activeTab === "active" && <td className="py-4 px-4 text-sm text-gray-900">{business.amount}</td>}
                    {activeTab === "pending" && (
                      <td className="py-4 px-4 text-sm text-gray-900">
                        <button
                          className="text-[#0082ed] hover:underline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApprove(business.id)
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
                </select>
                <span className="ml-4 text-sm text-gray-700">
                  showing 1-{Math.min(rowsPerPage, filteredBusinesses.length)} of {filteredBusinesses.length} rows
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

      {selectedBusiness && (
        <CleaningBusinessRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          business={selectedBusiness}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      )}

      {selectedBusiness && (
        <CleaningBusinessDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          business={selectedBusiness}
        />
      )}
    </div>
  )
}

