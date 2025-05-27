"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Loader2, AlertCircle, ChevronDown, ChevronUp, Clock, Flame, Utensils, Heart, Wheat, Salad, Info, Star, Users, HeartPulse } from 'lucide-react'

const NutritionGuide = () => {
  const [formData, setFormData] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    preferences: "",
  })
  const [storedAllergies, setStoredAllergies] = useState([])
  const [loadingAllergies, setLoadingAllergies] = useState(true)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedItem, setExpandedItem] = useState(null)
  const [activeTab, setActiveTab] = useState("form")

  // Fetch allergies from database on component mount
  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const email = localStorage.getItem("email")
        if (!email) return
        
        const response = await axios.get(`http://localhost:3001/get-allergies?email=${email}`)
        setStoredAllergies(response.data.allergies || [])
      } catch (err) {
        console.error("Failed to fetch allergies:", err)
      } finally {
        setLoadingAllergies(false)
      }
    }

    fetchAllergies()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const preferencesArray = formData.preferences
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    try {
      const response = await axios.post(`http://127.0.0.1:5000/nutritional-recommendation`, {
        calories: formData.calories ? parseFloat(formData.calories) : null,
        protein: formData.protein ? parseFloat(formData.protein) : null,
        carbs: formData.carbs ? parseFloat(formData.carbs) : null,
        fat: formData.fat ? parseFloat(formData.fat) : null,
        fiber: formData.fiber ? parseFloat(formData.fiber) : null,
        allergies: storedAllergies, // Using stored allergies only
        preferences: preferencesArray,
      })

      setRecommendations(response.data || [])
      if (response.data && response.data.length > 0) {
        setActiveTab("results")
      }
    } catch (err) {
      setError("⚠️ Failed to fetch nutrition recommendations. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (index) => {
    setExpandedItem(expandedItem === index ? null : index)
  }

  const isFormValid =
    formData.calories || formData.protein || formData.carbs || formData.fat || formData.fiber

  const formatInstructions = (instructions) => {
    if (!instructions || instructions === "Not available") {
      return <p className="text-gray-400 italic">Instructions not available</p>
    }

    if (Array.isArray(instructions)) {
      return (
        <ol className="list-decimal pl-5 space-y-2">
          {instructions.map((step, idx) => (
            <li key={idx} className="text-gray-300">{step}</li>
          ))}
        </ol>
      )
    }

    return <p className="text-gray-300">{instructions}</p>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-200 pt-16 px-6 pb-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <HeartPulse className="h-10 w-10 text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              Arogya Bite
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Nutrition-Based Food Guide</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get personalized food suggestions based on your dietary needs and preferences.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex border-b border-gray-700">
            <button
              className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${
                activeTab === "form"
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("form")}
            >
              <Info className="h-4 w-4" />
              Nutritional Targets
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${
                activeTab === "results"
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("results")}
              disabled={recommendations.length === 0}
            >
              <Star className="h-4 w-4" />
              Recommendations {recommendations.length > 0 && `(${recommendations.length})`}
            </button>
          </div>
        </div>

        {activeTab === "form" && (
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 mb-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                  <Flame className="h-6 w-6 text-orange-400" />
                  Target Nutrients
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="calories" className="block text-gray-300 mb-3 flex items-center gap-2">
                      <Flame className="h-5 w-5 text-orange-400" />
                      Calories (kcal)
                    </label>
                    <input
                      id="calories"
                      type="number"
                      name="calories"
                      value={formData.calories}
                      onChange={handleChange}
                      placeholder="e.g., 500"
                      className="w-full p-3.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="protein" className="block text-gray-300 mb-3 flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-blue-400" />
                      Protein (g)
                    </label>
                    <input
                      id="protein"
                      type="number"
                      name="protein"
                      value={formData.protein}
                      onChange={handleChange}
                      placeholder="e.g., 20"
                      className="w-full p-3.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="carbs" className="block text-gray-300 mb-3 flex items-center gap-2">
                      <Wheat className="h-5 w-5 text-yellow-400" />
                      Carbs (g)
                    </label>
                    <input
                      id="carbs"
                      type="number"
                      name="carbs"
                      value={formData.carbs}
                      onChange={handleChange}
                      placeholder="e.g., 50"
                      className="w-full p-3.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="fat" className="block text-gray-300 mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-400" />
                      Fat (g)
                    </label>
                    <input
                      id="fat"
                      type="number"
                      name="fat"
                      value={formData.fat}
                      onChange={handleChange}
                      placeholder="e.g., 15"
                      className="w-full p-3.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="fiber" className="block text-gray-300 mb-3 flex items-center gap-2">
                      <Salad className="h-5 w-5 text-green-400" />
                      Fiber (g)
                    </label>
                    <input
                      id="fiber"
                      type="number"
                      name="fiber"
                      value={formData.fiber}
                      onChange={handleChange}
                      placeholder="e.g., 5"
                      className="w-full p-3.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-yellow-400" />
                  Dietary Restrictions & Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-3">
                      Your Allergies (from profile)
                    </label>
                    {loadingAllergies ? (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading your allergies...
                      </div>
                    ) : storedAllergies.length > 0 ? (
                      <div className="p-3.5 bg-gray-700 border border-gray-600 rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {storedAllergies.map((allergy, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-gray-600 rounded-full text-sm"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
                        No allergies in your profile
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="preferences" className="block text-gray-300 mb-3">
                      Food Preferences (comma separated)
                    </label>
                    <input
                      id="preferences"
                      type="text"
                      name="preferences"
                      value={formData.preferences}
                      onChange={handleChange}
                      placeholder="e.g., chicken, spinach, rice"
                      className="w-full p-3.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {!isFormValid && (
                <div className="flex items-center gap-3 text-amber-300 text-sm bg-amber-900/30 p-4 rounded-lg">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>Enter at least one target nutrient to proceed with recommendations.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-3.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Finding Foods...
                  </>
                ) : (
                  <>
                    <Utensils className="h-5 w-5" />
                    Get Food Recommendations
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {activeTab === "results" && (
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 text-green-500 animate-spin mb-4" />
                <p className="text-gray-400">Finding the perfect foods for you...</p>
              </div>
            ) : recommendations.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Star className="h-6 w-6 text-yellow-400" />
                  Recommended Foods
                </h2>
                <div className="space-y-4">
                  {recommendations.map((food, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors">
                      <div
                        className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-750"
                        onClick={() => toggleExpand(index)}
                      >
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="text-xl font-semibold text-white">{food.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-sm bg-green-900/50 text-green-300 px-3 py-1 rounded-full">
                                {Math.round(food.nutrition_score * 100)}% match
                              </span>
                              <button className="text-gray-400 hover:text-white p-1">
                                {expandedItem === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>
                          {food.category && (
                            <p className="text-sm text-gray-400 mt-1">
                              {food.category}
                            </p>
                          )}
                        </div>
                      </div>

                      {expandedItem === index && (
                        <div className="p-5 bg-gray-750 border-t border-gray-700 space-y-6">
                          {/* Description */}
                          {food.description && food.description !== "No description available" && (
                            <div>
                              <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                                <Info className="h-5 w-5 text-blue-400" />
                                Description
                              </h4>
                              <p className="text-gray-300">{food.description}</p>
                            </div>
                          )}

                          {/* Recipe Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                              <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-400" />
                                Preparation Time
                              </h4>
                              <p className="text-gray-300">{food.prep_time}</p>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                              <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                                <Flame className="h-4 w-4 text-orange-400" />
                                Cooking Time
                              </h4>
                              <p className="text-gray-300">{food.cook_time}</p>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                              <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                                <Users className="h-4 w-4 text-green-400" />
                                Servings
                              </h4>
                              <p className="text-gray-300">{food.servings || "Not specified"}</p>
                            </div>
                          </div>

                          {/* Ingredients */}
                          <div>
                            <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                              <Salad className="h-5 w-5 text-green-400" />
                              Ingredients
                            </h4>
                            {food.ingredients_list && food.ingredients_list.length > 0 ? (
                              <ul className="list-disc pl-5 grid grid-cols-1 md:grid-cols-2 gap-2">
                                {food.ingredients_list.map((ingredient, idx) => (
                                  <li key={idx} className="text-gray-300">{ingredient}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-300">{food.ingredients || "No ingredients listed"}</p>
                            )}
                          </div>

                          {/* Nutritional Information */}
                          <div>
                            <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                              <Info className="h-5 w-5 text-blue-400" />
                              Nutritional Information
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {Object.entries(food.nutrients).map(([nutrient, value]) => (
                                <div key={nutrient} className="bg-gray-800 px-4 py-3 rounded-lg border border-gray-700">
                                  <p className="text-xs text-gray-400 uppercase tracking-wider">{nutrient}</p>
                                  <p className="text-sm font-medium text-white mt-1">
                                    {typeof value === 'number' ? value.toFixed(1) : value}
                                    {nutrient === 'calories' ? '' : 'g'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recipe Instructions */}
                          <div>
                            <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                              <Utensils className="h-5 w-5 text-red-400" />
                              Recipe Instructions
                            </h4>
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                              {formatInstructions(food.instructions)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="flex flex-col items-center text-gray-400">
                  <Salad className="h-14 w-14 mb-4 text-gray-500" />
                  <h3 className="text-xl font-medium text-white mb-2">No Recommendations Found</h3>
                  <p className="mb-4">Try adjusting your nutritional targets or preferences</p>
                  <button 
                    onClick={() => setActiveTab("form")} 
                    className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg transition-colors"
                  >
                    Adjust Criteria
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default NutritionGuide