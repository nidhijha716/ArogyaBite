import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: localStorage.getItem("email"),
    age: '',
    gender: '',
    weight: '',
    height: '',
    foodPreference: '',
    allergies: [],
    activityLevel: '',
  });

  useEffect(() => {
    axios.get(`http://localhost:3001/get-profile?email=${formData.email}`)
      .then(res => {
        if (res.data) {
          setFormData({ ...formData, ...res.data });
        }
      });
  }, []);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
        ...formData,
        age: formData.age ? Number(formData.age) : null,
        height: formData.height ? Number(formData.height) : null,
        weight: formData.weight ? Number(formData.weight) : null,
      };
      console.log("Payload being sent:", payload);

    axios.put("http://localhost:3001/update-profile", formData)
      .then(() => {
        // console.log("Response:", response.data);
        alert("Profile saved successfully!");
        navigate('/home');
      });
      
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4 text-center">Complete Your Profile</h2>
          <form onSubmit={handleSubmit}>
            {/* Age Field */}
            <div className="mb-3">
              <label htmlFor="age" className="form-label fw-bold">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                className="form-control"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                required
              />
            </div>

            {/* Height Field */}
            <div className="mb-3">
              <label htmlFor="height" className="form-label fw-bold">Height (cm)</label>
              <input
                id="height"
                name="height"
                type="number"
                className="form-control"
                value={formData.height}
                onChange={handleChange}
                placeholder="Enter height in centimeters"
                required
              />
            </div>

            {/* Weight Field */}
            <div className="mb-3">
              <label htmlFor="weight" className="form-label fw-bold">Weight (kg)</label>
              <input
                id="weight"
                name="weight"
                type="number"
                className="form-control"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Enter weight in kilograms"
                required
              />
            </div>

            {/* Gender Field */}
            <div className="mb-3">
              <label htmlFor="gender" className="form-label fw-bold">Gender</label>
              <select
                id="gender"
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Food Preference Field */}
            <div className="mb-3">
              <label htmlFor="foodPreference" className="form-label fw-bold">Food Preference</label>
              <select
                id="foodPreference"
                name="foodPreference"
                className="form-select"
                value={formData.foodPreference}
                onChange={handleChange}
                required
              >
                <option value="">Select your food preference</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            {/* Allergies Field */}
            <div className="mb-3">
              <label htmlFor="allergies" className="form-label fw-bold">Allergies</label>
              <input
                id="allergies"
                type="text"
                className="form-control"
                value={formData.allergies.join(", ")}
                onChange={(e) => {
                  const array = e.target.value.split(",").map(item => item.trim());
                  setFormData({ ...formData, allergies: array });
                }}
                placeholder="List your allergies, separated by commas (e.g., peanuts, shellfish)"
              />
              <div className="form-text">Leave blank if you have no allergies</div>
            </div>

            {/* Activity Level Field */}
            <div className="mb-4">
              <label htmlFor="activityLevel" className="form-label fw-bold">Activity Level</label>
              <select
                id="activityLevel"
                name="activityLevel"
                className="form-select"
                value={formData.activityLevel}
                onChange={handleChange}
                required
              >
                <option value="">Select your activity level</option>
                <option value="Sedentary">Sedentary (little or no exercise)</option>
                <option value="Lightly Active">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="Moderately Active">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="Very Active">Very Active (hard exercise 6-7 days/week)</option>
                <option value="Extra Active">Extra Active (very hard exercise and physical job)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-warning w-100 py-2 fw-bold">
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;