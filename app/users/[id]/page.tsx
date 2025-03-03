"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Phone, Mail, MapPin, FileText } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import Image from "next/image"
import Link from "next/link"

interface Property {
  type: string
  name: string
  location: string
  images: string[]
  manager: string
}

interface Limpiador {
  name: string
  email: string
  phone: string
  address: string
  createDate: string
  updateDate: string
}

interface Booking {
  property: string
  propertyManager: string
  service: string
  amount: string
  date: string
  time: string
  additionalNote: string
  status: "Pending" | "Completed" | "Cancelled"
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  companyName?: string
  status?: boolean
}

const propertyManagerUsers: User[] = [
  {
    id: "1",
    name: "Jerome Bell",
    email: "jerome.bell@example.com",
    phone: "(270) 555-0117",
    address: "3517 W. Gray St. Utica, Pennsylvania 57867",
  },
]

const cleaningBusinessUsers: User[] = [
  {
    id: "2",
    name: "Robert Fox",
    email: "robert.fox@example.com",
    phone: "(219) 555-0114",
    companyName: "Happy Cleaners LLC.",
    status: true,
  },
]

const limpiadorUsers: User[] = [
  {
    id: "3",
    name: "Kathryn Murphy",
    email: "kathryn.murphy@example.com",
    phone: "(307) 555-0133",
    companyName: "Happy Cleaners LLC.",
    status: false,
  },
]

const properties: Property[] = [
  {
    type: "Hospital",
    name: "Elite Enclave",
    location: "3605 Parker Rd.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    manager: "Robert Fox",
  },
  {
    type: "Warehouse",
    name: "Horizon Heights",
    location: "3890 Poplar Dr.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    manager: "Annette Black",
  },
  // Add more properties...
]

const limpiadores: Limpiador[] = [
  {
    name: "Robert Fox",
    email: "example@email.com",
    phone: "(219) 555-0114",
    address: "4517 Washington...",
    createDate: "11 June, 2025",
    updateDate: "11 June, 2025",
  },
  // Add more limpiadores...
]

const bookings: Booking[] = [
  {
    property: "Opal Ridge Retreat",
    propertyManager: "Kathryn Murphy",
    service: "Janitorial",
    amount: "$ 100.00",
    date: "11 June, 2025",
    time: "11:50 am",
    additionalNote: "Craig provided great...",
    status: "Pending",
  },
  {
    property: "Sunset Villa",
    propertyManager: "Darrell Steward",
    service: "Pool Cleaning",
    amount: "$ 200.00",
    date: "11 June, 2025",
    time: "11:50 am",
    additionalNote: "Had a great and fr...",
    status: "Completed",
  },
  // Add more bookings...
]

// Mock function to fetch user data
const fetchUserData = (id: string) => {
  // This would be replaced with an actual API call
  const allUsers = [...propertyManagerUsers, ...cleaningBusinessUsers, ...limpiadorUsers]
  return allUsers.find((user) => user.id === id)
}

export default function UserProfile() {
  const router = useRouter()
  const params = useParams()
  const [activeTab, setActiveTab] = useState("Property")
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    if (params && params.id) {
      const user = fetchUserData(params.id as string)
      setUserData(user || null)
    }
  }, [params])

  if (!userData) {
    return <div>Loading...</div>
  }

  const userType = userData.companyName
    ? userData.status
      ? "Cleaning Business Admin"
      : "Limpiador"
    : "Property Manager"

  const getTabs = () => {
    switch (userType) {
      case "Property Manager":
        return ["Property", "Booking History", "Transaction History"]
      case "Cleaning Business Admin":
        return ["Limpiador", "Booking History", "Transaction History"]
      case "Limpiador":
        return ["Booking History", "Transaction History"]
      default:
        return []
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-[240px]">
        <div className="p-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <span className="text-gray-500">/</span>
            <Link href="/users" className="text-gray-500 hover:text-gray-700">
              Users
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900">{userData.name}</span>
          </div>

          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <Image src="/placeholder.svg" alt={userData.name} width={96} height={96} className="object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold mb-1">{userData.name}</h1>
              <p className="text-gray-500 mb-2">{userType}</p>
              {userData.companyName && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 bg-red-500 rounded-sm" />
                  <span>{userData.companyName}</span>
                </div>
              )}
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone className="h-4 w-4" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>{userData.email}</span>
                </div>
                {userData.address && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{userData.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {getTabs().map((tab) => (
                <button
                  key={tab}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-[#0082ed] text-[#0082ed]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200">
            {activeTab === "Property" && userType === "Property Manager" && (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="w-8 py-3 px-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Property Type</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Property Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Property Manager
                    </th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-4 px-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">{property.type}</td>
                      <td className="py-4 px-4 text-sm text-gray-900">{property.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{property.location}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          {property.images.slice(0, 3).map((img, i) => (
                            <div key={i} className="w-8 h-8 rounded bg-gray-200" />
                          ))}
                          <span className="text-sm text-gray-500">+5</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">{property.manager}</td>
                      <td className="py-4 px-4">
                        <button className="text-sm text-[#0082ed] hover:underline">Approve</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "Limpiador" && userType === "Cleaning Business Admin" && (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="w-8 py-3 px-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Create Date</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Update Date</th>
                  </tr>
                </thead>
                <tbody>
                  {limpiadores.map((limpiador, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-4 px-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">{limpiador.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{limpiador.email}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{limpiador.phone}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{limpiador.address}</td>
                      <td className="py-4 px-4">
                        <button className="hover:bg-gray-100 p-1 rounded">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </button>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">{limpiador.createDate}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{limpiador.updateDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "Booking History" && (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="w-8 py-3 px-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Property Manager
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Additional Note</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-4 px-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">{booking.property}</td>
                      <td className="py-4 px-4 text-sm text-gray-900">{booking.propertyManager}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{booking.service}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{booking.amount}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{booking.date}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{booking.time}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{booking.additionalNote}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <div className="flex items-center">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select className="ml-2 border-gray-300 rounded-md text-sm">
                  <option>10</option>
                  <option>20</option>
                  <option>30</option>
                </select>
                <span className="ml-4 text-sm text-gray-700">showing 1-10 of 30 rows</span>
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
    </div>
  )
}

