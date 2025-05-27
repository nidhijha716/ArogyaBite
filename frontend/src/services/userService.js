import axios from 'axios';

export const fetchUserAllergies = async (email) => {
  try {
    const response = await axios.get('http://localhost:3001/get-allergies', {
      params: { email }, 
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      }
    });
    return response.data.allergies;
  } catch (error) {
    console.error("Error fetching allergies:", error);
    return []; 
  }
};