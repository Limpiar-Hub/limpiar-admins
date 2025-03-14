const API_BASE_URL = "https://limpiar-backend.onrender.com/api"

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

