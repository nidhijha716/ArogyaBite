import React, { useState } from 'react';
import axios from 'axios';
import { AlertCircle, Loader2, ChefHat, Heart, Star, Salad } from 'lucide-react';
import { useEffect } from 'react';

const RecipeRecommendation = () => {
  const [allergies, setAllergies] = useState('');
  const [preferences, setPreferences] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/get-allergies?email=${email}`);
        if (response.data.allergies) {
          setAllergies(response.data.allergies.join(', '));
        }
      } catch (err) {
        setError('Failed to fetch allergies. Please check your backend or network.');
      }
    };

    if (email) {
      fetchAllergies();
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSelectedRecipe(null);

    const preferencesArray = preferences.split(',').map((item) => item.trim()).filter(Boolean);

    try {
      const response = await axios.post('http://127.0.0.1:5000/recommend', {
        email: email,
        preferences: preferencesArray,
      });
      setRecommendations(response.data);
    } catch (err) {
      setError('Failed to fetch recommendations. Please check your backend or network.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    // Here you would typically navigate to a recipe detail page or show a modal
    console.log("Viewing recipe:", recipe);
    // For now, we'll just log it to the console
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-teal-400 text-transparent bg-clip-text">
            <ChefHat className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Arogya Bite</h1>
          </div>
          <p className="mt-3 text-lg text-gray-400">
            Discover personalized recipe recommendations tailored to your dietary needs
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Salad className="h-6 w-6 text-green-400" />
            Your Preferences
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-300 mb-2">
                  Dietary Restrictions
                </label>
                <div className="relative">
                  <input
                    id="allergies"
                    type="text"
                    value={allergies}
                    readOnly
                    placeholder="No allergies detected"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-200"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                      Auto-detected
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="preferences" className="block text-sm font-medium text-gray-300 mb-2">
                  What are you craving?
                </label>
                <input
                  id="preferences"
                  type="text"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g., spinach, oats, chicken"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Finding your perfect recipes...
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5" />
                  Get Recommendations
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 flex items-start gap-3 p-4 bg-red-900/30 border border-red-700 rounded-lg text-sm text-red-200">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {recommendations.length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-400" />
              Recommended Recipes
            </h2>

            <div className="space-y-5">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600 rounded-xl p-6 transition-all duration-200">
                  <h3 className="text-xl font-semibold text-white mb-3">{rec.Name}</h3>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Ingredients:</h4>
                    <p className="text-gray-400">{rec.Ingredients_name}</p>
                  </div>
                  {/* <button 
                    onClick={() => handleViewRecipe(rec)}
                    className="mt-4 text-sm font-medium text-green-400 hover:text-green-300 transition-colors cursor-pointer"
                  >
                    View full recipe →
                  </button> */}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && recommendations.length === 0 && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 text-center">
            <ChefHat className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400">No recommendations yet</h3>
            <p className="text-gray-500 mt-2">
              Enter your food preferences above to discover delicious recipes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeRecommendation;