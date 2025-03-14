const API_BASE_URL = "https://limpiar-backend.onrender.com/api"

// Get all users
export const fetchUsers = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Get user by ID
export const fetchUserById = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Get all property managers
export const fetchPropertyManagers = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/property-managers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Get all cleaning businesses
export const fetchCleaningBusinesses = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/cleaning-businesses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Get all cleaners
export const fetchCleaners = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/cleaners`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Get specific property manager by ID
export const fetchPropertyManagerById = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/users/property-manager/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Get specific cleaning business by ID
export const fetchCleaningBusinessById = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/users/cleaning-business/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Get specific cleaner by ID
export const fetchCleanerById = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/users/cleaner/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Update user
export const updateUser = async (token: string, id: string, userData: any) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// PROPERTY MANAGEMENT API ENDPOINTS

// Get all properties
export const fetchProperties = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/properties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Get property by ID
export const fetchPropertyById = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Create new property
export const createProperty = async (token: string, propertyData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/properties`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: propertyData,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Update property
export const updateProperty = async (token: string, id: string, propertyData: any) => {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(propertyData),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Delete property
export const deleteProperty = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Verify property creation
export const verifyPropertyCreation = async (token: string, propertyId: string, propertyManagerId: string) => {
  const response = await fetch(`${API_BASE_URL}/properties/verify-creation`, {
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

  return response.json()
}

