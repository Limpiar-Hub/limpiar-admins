"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "@/components/sidebar"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyDetailsModal } from "@/components/property-details-modal"
import { toast } from "@/components/ui/use-toast"

interface Property {
  _id: string
  name: string
  address: string
  type: string
  subType: string
  size: string
  propertyManagerId: string
  status: "pending" | "verified"
  createdAt: string
  updatedAt: string
  managerId: string
}

export default function PropertyPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "verified">("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("https://limpiar-backend.onrender.com/api/properties", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProperties(data.data)
    } catch (error) {
      console.error("Error fetching properties:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      toast({
        title: "Error",
        description: `Failed to fetch properties: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const handlePropertyClick = async (property: Property) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`https://limpiar-backend.onrender.com/api/properties/${property._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSelectedProperty(data.data)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error fetching property details:", error)
      toast({
        title: "Error",
        description: `Failed to fetch property details: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const verifyProperty = async (propertyId: string, propertyManagerId: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("https://limpiar-backend.onrender.com/api/properties/verify-creation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ propertyId, propertyManagerId }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProperties(properties.map((p) => (p._id === propertyId ? { ...p, status: "verified" } : p)))
      toast({
        title: "Success",
        description: "Property verified successfully.",
      })
    } catch (error) {
      console.error("Error verifying property:", error)
      toast({
        title: "Error",
        description: `Failed to verify property: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteProperty = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`https://limpiar-backend.onrender.com/api/properties/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setProperties(properties.filter((p) => p._id !== id))
      toast({
        title: "Success",
        description: "Property deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting property:", error)
      toast({
        title: "Error",
        description: `Failed to delete property: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleUpdateProperty = async (id: string, updatedData: Partial<Property>) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`https://limpiar-backend.onrender.com/api/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProperties(properties.map((p) => (p._id === id ? data.data : p)))
      toast({
        title: "Success",
        description: "Property updated successfully.",
      })
    } catch (error) {
      console.error("Error updating property:", error)
      toast({
        title: "Error",
        description: `Failed to update property: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const filteredProperties = properties.filter(
    (property) =>
      property.status === activeTab &&
      (property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-[240px]">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Property</h1>
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
                Add Property
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
                  Pending
                </button>
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "verified"
                      ? "border-[#0082ed] text-[#0082ed]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("verified")}
                >
                  Verified
                </button>
              </nav>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">
                {error}
                <Button onClick={fetchProperties} className="ml-2">
                  Retry
                </Button>
              </div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property Type
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property) => (
                    <tr
                      key={property._id}
                      className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handlePropertyClick(property)}
                    >
                      <td className="py-4 px-4 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{property.type}</div>
                          <div className="text-gray-500">{property.subType}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">{property.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{property.address}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{property.size}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        {property.status === "pending" && (
                          <button
                            className="text-sm text-[#0082ed] hover:underline"
                            onClick={() => verifyProperty(property._id, property.propertyManagerId)}
                          >
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {selectedProperty && (
        <PropertyDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          property={selectedProperty}
          onVerify={verifyProperty}
          onDelete={handleDeleteProperty}
          onUpdate={handleUpdateProperty}
        />
      )}
    </div>
  )
}

