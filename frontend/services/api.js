import api from "./apiClient"

// Allergy Profile APIs
export const getAllergyProfiles = async () => {
  try {
    const response = await api.get("/users/allergy-profiles")
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch allergy profiles" }
  }
}

export const addAllergyProfile = async (profileData) => {
  try {
    const response = await api.post("/users/allergy-profiles", profileData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to add allergy profile" }
  }
}

export const updateAllergyProfile = async (profileId, profileData) => {
  try {
    const response = await api.put(`/users/allergy-profiles/${profileId}`, profileData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to update allergy profile" }
  }
}

export const deleteAllergyProfile = async (profileId) => {
  try {
    const response = await api.delete(`/users/allergy-profiles/${profileId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete allergy profile" }
  }
}

// User Preferences API
export const updateUserPreferences = async (preferencesData) => {
  try {
    const response = await api.put("/users/preferences", preferencesData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Failed to update preferences" }
  }
}
