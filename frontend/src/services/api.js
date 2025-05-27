import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// =======================
// Smart Diet Planner APIs
// =======================

export const getRecipeRecommendations = async (nutritionInput, ingredients = [], params = {}) => {
  try {
    const response = await api.post('/predict/', {
      nutrition_input: nutritionInput,
      ingredients,
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe recommendations:', error);
    throw error;
  }
};

export const getDietPlan = async (userData) => {
  try {
    const response = await api.post('/diet-plan/', userData);
    return response.data;
  } catch (error) {
    console.error('Error generating diet plan:', error);
    throw error;
  }
};

export const getNutritionGuide = async (nutritionData) => {
  try {
    const response = await api.post('/nutrition-guide/', nutritionData);
    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition guide:', error);
    throw error;
  }
};

// =======================
// Allergy Profile APIs
// =======================

export const getAllergyProfiles = async () => {
  try {
    const response = await api.get('/users/allergy-profiles');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch allergy profiles' };
  }
};

export const addAllergyProfile = async (profileData) => {
  try {
    const response = await api.post('/users/allergy-profiles', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add allergy profile' };
  }
};

export const updateAllergyProfile = async (profileId, profileData) => {
  try {
    const response = await api.put(`/users/allergy-profiles/${profileId}`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update allergy profile' };
  }
};

export const deleteAllergyProfile = async (profileId) => {
  try {
    const response = await api.delete(`/users/allergy-profiles/${profileId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete allergy profile' };
  }
};

// =======================
// User Preferences API
// =======================

export const updateUserPreferences = async (preferencesData) => {
  try {
    const response = await api.put('/users/preferences', preferencesData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update preferences' };
  }
};