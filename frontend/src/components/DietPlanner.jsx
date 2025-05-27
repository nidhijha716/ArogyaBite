import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Utensils, Scale, Activity, User, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DietPlanner = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    preferences: '',
    goal: 'maintain',
    meals_per_day: '3'
  });
  const [loading, setLoading] = useState({
    profile: true,
    submission: false
  });
  const [error, setError] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:3001/get-profile?email=${email}`);
        setProfile(response.data);
      } catch (err) {
        setError("Failed to load profile data. Please try again.");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(prev => ({...prev, profile: false}));
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({...prev, submission: true}));
    setError(null);
    setDietPlan(null);

    try {
      const email = localStorage.getItem("email");
      if (!email) {
        navigate('/login');
        return;
      }

      if (!profile) {
        throw new Error("Profile data not loaded");
      }

      const response = await axios.post("http://localhost:5000/diet-plan", {
        email: email,
        preferences: formData.preferences,
        goal: formData.goal,
        meals_per_day: formData.meals_per_day
      });

      setDietPlan(response.data);
    } catch (err) {
      console.error("Diet plan error:", err.response?.data || err.message);
      setError(err.response?.data?.error || err.message || "Failed to generate diet plan");
    } finally {
      setLoading(prev => ({...prev, submission: false}));
    }
  };

  if (loading.profile) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-300">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span>Loading your profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10 text-gray-300">
        <p className="text-red-400 mb-4">Failed to load profile data</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-200 pt-16 px-6 pb-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <HeartPulse className="text-green-400" size={28} />
          <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
            Smart Diet Planner
          </span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Information Section */}
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="text-blue-400" size={18} />
                  Your Profile
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Height</label>
                    <div className="p-2 bg-gray-700 rounded border border-gray-600">{profile.height} cm</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Weight</label>
                    <div className="p-2 bg-gray-700 rounded border border-gray-600">{profile.weight} kg</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Age</label>
                    <div className="p-2 bg-gray-700 rounded border border-gray-600">{profile.age}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Gender</label>
                    <div className="p-2 bg-gray-700 rounded border border-gray-600 capitalize">{profile.gender}</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1">
                    <Activity size={14} /> Activity Level
                  </label>
                  <div className="p-2 bg-gray-700 rounded border border-gray-600 capitalize">
                    {profile.activityLevel || 'Not specified'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Allergies</label>
                  <div className="p-2 bg-gray-700 rounded border border-gray-600">
                    {profile.allergies?.length > 0 ? profile.allergies.join(", ") : "None"}
                  </div>
                </div>
              </div>

              {/* Diet Preferences Section */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="preferences" className="block mb-1 font-medium text-gray-300">
                    Food Preferences
                  </label>
                  <input
                    id="preferences"
                    name="preferences"
                    type="text"
                    value={formData.preferences}
                    onChange={handleChange}
                    placeholder="e.g., chicken, rice, vegetables (comma separated)"
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-200"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="goal" className="block mb-1 font-medium text-gray-300">
                      Diet Goal
                    </label>
                    <select
                      id="goal"
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-200"
                      required
                    >
                      <option value="maintain">Maintain Weight</option>
                      <option value="lose">Lose Weight</option>
                      <option value="gain">Gain Weight</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="meals_per_day" className="block mb-1 font-medium text-gray-300">
                      Meals Per Day
                    </label>
                    <select
                      id="meals_per_day"
                      name="meals_per_day"
                      value={formData.meals_per_day}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-200"
                      required
                    >
                      <option value="3">3 meals</option>
                      <option value="4">4 meals</option>
                      <option value="5">5 meals</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading.submission}
                  className={`w-full py-3 px-4 rounded font-medium text-white transition-all ${
                    loading.submission 
                      ? 'bg-green-700' 
                      : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                  } flex items-center justify-center gap-2`}
                >
                  {loading.submission ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Utensils size={18} />
                      Generate Diet Plan
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-900/30 text-red-200 rounded border border-red-700 flex items-start gap-2">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}
          </div>

          {/* Diet Plan Display Section */}
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Scale className="text-yellow-400" size={20} />
              Your Diet Plan
            </h2>
            
            {dietPlan ? (
              <div className="space-y-6">
                {/* Nutrition Summary */}
                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <h3 className="font-semibold mb-3 text-gray-300">Nutrition Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800 p-3 rounded text-center border border-gray-600">
                      <p className="text-sm text-gray-400">BMI</p>
                      <p className="text-xl font-bold text-white">{dietPlan.bmi}</p>
                      <p className={`text-xs ${
                        dietPlan.bmi_category === 'Normal' ? 'text-green-400' :
                        dietPlan.bmi_category === 'Overweight' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {dietPlan.bmi_category}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded text-center border border-gray-600">
                      <p className="text-sm text-gray-400">Daily Calories</p>
                      <p className="text-xl font-bold text-white">{dietPlan.daily_calories}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded text-center border border-gray-600">
                      <p className="text-sm text-gray-400">Protein</p>
                      <p className="text-xl font-bold text-white">{dietPlan.macros.protein}g</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded text-center border border-gray-600">
                      <p className="text-sm text-gray-400">Carbs | Fat</p>
                      <p className="text-lg font-bold text-white">{dietPlan.macros.carbs}g | {dietPlan.macros.fat}g</p>
                    </div>
                  </div>
                </div>

                {/* Horizontal Days Navigation */}
                <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
                  {Object.keys(dietPlan.meal_plan).map(day => (
                    <button
                      key={day}
                      onClick={() => document.getElementById(day)?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg whitespace-nowrap transition-colors"
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Days in Horizontal Scroll */}
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex space-x-4" style={{ minWidth: `${Object.keys(dietPlan.meal_plan).length * 300}px` }}>
                    {Object.entries(dietPlan.meal_plan).map(([day, meals]) => (
                      <div key={day} id={day} className="w-72 flex-shrink-0 border border-gray-600 rounded-lg p-4 bg-gray-700">
                        <h3 className="font-bold text-lg mb-3 text-white">{day}</h3>
                        <div className="space-y-3">
                          {Object.entries(meals).map(([mealType, meal]) => (
                            <div key={mealType} className="border-b border-gray-600 pb-3 last:border-b-0">
                              <h4 className="font-medium text-green-400 capitalize">{mealType}</h4>
                              <p className="text-sm text-gray-300">{meal.recipe}</p>
                              <div className="flex justify-between text-xs mt-1 text-gray-500">
                                <span>{meal.calories} cal</span>
                                <span>P: {meal.protein}g</span>
                                <span>C: {meal.carbs}g</span>
                                <span>F: {meal.fat}g</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                {loading.submission ? (
                  <Loader2 className="animate-spin mx-auto" size={24} />
                ) : (
                  <div className="flex flex-col items-center">
                    <Utensils size={32} className="mb-3 text-gray-600" />
                    <p>Your generated diet plan will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlanner;