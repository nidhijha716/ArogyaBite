from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
import re
import json


app = Flask(__name__)
# CORS(app)  
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
# CORS(app, resources={
#     r"/nutritional-recomendation": {"origins": "http://localhost:5173"},
#     r"/get-allergies": {"origins": "http://localhost:5173"}
# })

client = MongoClient("mongodb://localhost:27017/")  
db = client["ArogyaBite"]  
users_collection = db["log_reg_forms"]  


# Load the Word2Vec model and recipe dataset
with open('models/word2vec_model.pkl', 'rb') as f:
    word2vec_model = pickle.load(f)

df = pd.read_csv('datasets/Food_Recipes_Cleaned.csv')
df_nutrition = pd.read_csv('datasets/recipes.csv')

#RECIPE RECOmmender
def preprocess_ingredients(ingredient_list):
    return [ingredient.strip().lower() for ingredient in ingredient_list]

def average_vector(ingredients, model):
    vectors = [model.wv[word] for word in ingredients if word in model.wv]
    return np.mean(vectors, axis=0) if vectors else np.zeros(model.vector_size)

def recommend_recipes(allergies, preferences):
    allergies = preprocess_ingredients(allergies)
    preferences = preprocess_ingredients(preferences)

    preference_vector = average_vector(preferences, word2vec_model)

    recipe_vectors = []
    for ingredients in df['Ingredients_name']:
        if not isinstance(ingredients, str):
            recipe_vectors.append(np.zeros(word2vec_model.vector_size))
            continue
        ingredient_list = [i.strip().lower() for i in ingredients.split(',')]
        vec = average_vector(ingredient_list, word2vec_model)
        recipe_vectors.append(vec)

    similarity_scores = cosine_similarity([preference_vector], recipe_vectors)[0]
    df['similarity_score'] = similarity_scores

    def contains_allergen(ingredients):
        if not isinstance(ingredients, str):
            return False
        return any(allergen in ingredients.lower() for allergen in allergies)

    filtered_df = df[~df['Ingredients_name'].apply(contains_allergen)]
    top_recommendations = filtered_df.sort_values(by='similarity_score', ascending=False).head(5)

    return top_recommendations[['Name', 'Ingredients_name', 'similarity_score']].to_dict(orient='records')

#NUTRITIONAL RECOMMENDATION
# Format time string to be more readable
def format_time(time_str):
    if not time_str or pd.isna(time_str) or time_str == "Not available":
        return "Not available"
    
    if isinstance(time_str, str) and time_str.startswith('PT'):
        hours = 0
        minutes = 0
        
        hour_match = re.search(r'(\d+)H', time_str)
        if hour_match:
            hours = int(hour_match.group(1))
            
        minute_match = re.search(r'(\d+)M', time_str)
        if minute_match:
            minutes = int(minute_match.group(1))
            
        if hours > 0 and minutes > 0:
            return f"{hours} hour{'s' if hours > 1 else ''} {minutes} minute{'s' if minutes > 1 else ''}"
        elif hours > 0:
            return f"{hours} hour{'s' if hours > 1 else ''}"
        elif minutes > 0:
            return f"{minutes} minute{'s' if minutes > 1 else ''}"
    
    return str(time_str)
# Format instructions to be more readable
def format_instructions(instructions):
    if not instructions or pd.isna(instructions) or instructions == "Not available":
        return "Instructions not available"
    
    if isinstance(instructions, str):
        try:
            parsed = json.loads(instructions)
            if isinstance(parsed, list):
                return parsed
        except:
            pass
        
        if '\n' in instructions:
            steps = [step.strip() for step in instructions.split('\n') if step.strip()]
            return steps
        elif '.' in instructions:
            steps = [step.strip() + '.' for step in instructions.split('.') if step.strip()]
            return steps
    
    return [str(instructions)]


# Nutritional analysis and filtering functions
def filter_by_allergies(dataframe, allergies):
    if not allergies:
        return dataframe
    
    ingredients_column = 'Ingredients_name' if 'Ingredients_name' in dataframe.columns else 'Name'
    
    def contains_allergen(ingredients):
        if not isinstance(ingredients, str):
            return False
        return any(allergen.lower() in ingredients.lower() for allergen in allergies)
    
    return dataframe[~dataframe[ingredients_column].apply(contains_allergen)]

def calculate_nutrient_similarity(row, target_nutrients):
    score = 0
    count = 0
    
    for nutrient, target_value in target_nutrients.items():
        if nutrient in row and pd.notna(row[nutrient]) and target_value > 0:
            difference = abs(row[nutrient] - target_value)
            max_value = max(row[nutrient], target_value)
            if max_value > 0:
                relative_diff = difference / max_value
                score += (1 - relative_diff)
            count += 1
    
    return score / count if count > 0 else 0

def get_nutrition_recommendations(target_nutrients, allergies=None, preferences=None, num_recommendations=5):
    allergies = allergies or []
    preferences = preferences or []
    
    filtered_df = filter_by_allergies(df_nutrition, allergies)

    nutrient_map = {
        'calories': 'Calories', 
        'protein': 'ProteinContent', 
        'carbs': 'CarbohydrateContent',
        'fat': 'FatContent', 
        'fiber': 'FiberContent', 
        'sugar': 'SugarContent',
        'sodium': 'SodiumContent', 
        'cholesterol': 'CholesterolContent', 
        'saturated_fat': 'SaturatedFatContent'
    }
    
    available_columns = set(filtered_df.columns)
    valid_nutrient_map = {k: v for k, v in nutrient_map.items() if v in available_columns}
    
    target = {valid_nutrient_map[k]: v for k, v in target_nutrients.items() if k in valid_nutrient_map and v is not None and v > 0}
    
    if not target:
        return []

    scores = []
    for _, row in filtered_df.iterrows():
        score = calculate_nutrient_similarity(row, target)
        if preferences:
            ingredients_column = 'Ingredients_name' if 'Ingredients_name' in filtered_df.columns else 'Name'
            ingredients = str(row[ingredients_column]).lower()
            matches = sum(pref.lower() in ingredients for pref in preferences)
            score *= 1 + (matches / len(preferences))
        scores.append(score)

    filtered_df = filtered_df.copy()
    filtered_df['nutrition_score'] = scores
    
    top = filtered_df.sort_values(by='nutrition_score', ascending=False).head(num_recommendations)
    
    results = []
    for _, row in top.iterrows():
        nutrients = {}
        for k, v in valid_nutrient_map.items():
            if v in row and pd.notna(row[v]):
                nutrients[k] = float(row[v])
        
        ingredients_column = 'Ingredients_name' if 'Ingredients_name' in filtered_df.columns else 'Name'
        ingredients_text = row[ingredients_column] if ingredients_column in row else "No ingredients listed"
        instructions = format_instructions(row.get('RecipeInstructions', "Not available"))
        prep_time = format_time(row.get('PrepTime', "Not available"))
        cook_time = format_time(row.get('CookTime', "Not available"))
        total_time = format_time(row.get('TotalTime', "Not available"))
        
        ingredients_list = []
        if isinstance(ingredients_text, str):
            ingredients_list = [ing.strip() for ing in ingredients_text.split(',')]
        
        food_data = {
            "name": row['Name'],
            "ingredients": ingredients_text,
            "ingredients_list": ingredients_list,
            "nutrition_score": round(row['nutrition_score'], 2),
            "nutrients": nutrients,
            "instructions": instructions,
            "prep_time": prep_time,
            "cook_time": cook_time,
            "total_time": total_time,
            "image": row.get('Images', f"/placeholder.svg?height=200&width=200&text={row['Name']}")
        }
        
        results.append(food_data)
    
    return results

def find_food_alternatives(food_name, allergies=None, preferences=None, num_recommendations=5):
    allergies = allergies or []
    preferences = preferences or []
    
    original_food = None
    for _, row in df_nutrition.iterrows():
        if food_name.lower() in str(row['Name']).lower():
            original_food = row
            break
    
    if original_food is None:
        return {"error": "Food not found", "alternatives": []}
    
    nutrient_map = {
        'calories': 'Calories', 
        'protein': 'ProteinContent', 
        'carbs': 'CarbohydrateContent',
        'fat': 'FatContent', 
        'fiber': 'FiberContent', 
        'sugar': 'SugarContent',
        'sodium': 'SodiumContent', 
        'cholesterol': 'CholesterolContent', 
        'saturated_fat': 'SaturatedFatContent'
    }
    
    target_nutrients = {}
    for key, column in nutrient_map.items():
        if column in original_food and pd.notna(original_food[column]):
            target_nutrients[key] = float(original_food[column])
    
    alternatives = get_nutrition_recommendations(
        target_nutrients,
        allergies,
        preferences,
        num_recommendations
    )
    
    original_nutrients = {}
    for k, v in nutrient_map.items():
        if v in original_food and pd.notna(original_food[v]):
            original_nutrients[k] = float(original_food[v])
    
    ingredients_column = 'Ingredients_name' if 'Ingredients_name' in df_nutrition.columns else 'Name'
    ingredients_text = original_food[ingredients_column] if ingredients_column in original_food else "No ingredients listed"
    instructions = format_instructions(original_food.get('RecipeInstructions', "Not available"))
    prep_time = format_time(original_food.get('PrepTime', "Not available"))
    cook_time = format_time(original_food.get('CookTime', "Not available"))
    total_time = format_time(original_food.get('TotalTime', "Not available"))
    
    original_food_data = {
        "name": original_food['Name'],
        "ingredients": ingredients_text,
        "ingredients_list": [i.strip() for i in str(ingredients_text).split(',')] if isinstance(ingredients_text, str) else [],
        "nutrients": original_nutrients,
        "instructions": instructions,
        "prep_time": prep_time,
        "cook_time": cook_time,
        "total_time": total_time,
        "image": original_food.get('Images', f"/placeholder.svg?height=200&width=200&text={original_food['Name']}")
    }
    
    return {
        "original_food": original_food_data,
        "alternatives": alternatives
    }


# Smart Diet Planner Functions
def calculate_bmi(height, weight):
    """Calculate BMI from height (cm) and weight (kg)"""
    height_m = height / 100  # Convert cm to m
    bmi = weight / (height_m ** 2)
    return round(bmi, 2)

def get_bmi_category(bmi):
    """Determine BMI category"""
    if bmi < 18.5:
        return "Underweight"
    elif 18.5 <= bmi < 25:
        return "Normal"
    elif 25 <= bmi < 30:
        return "Overweight"
    else:
        return "Obese"

def calculate_bmr(weight, height, age, gender):
    """Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation"""
    if gender.lower() == 'male':
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    return bmr

def calculate_tdee(bmr, activity_level):
    """Calculate Total Daily Energy Expenditure"""
    activity_multipliers = {
        'sedentary': 1.2,
        'lightly active': 1.375,
        'moderately active': 1.55,
        'very active': 1.725,
        'extra active': 1.9
    }
    
    multiplier = activity_multipliers.get(activity_level.lower(), 1.2)
    return bmr * multiplier

def generate_meal_plan(height, weight, age, gender, activity_level, goal, allergies=None, preferences=None, meals_per_day=3):
    """Generate a personalized meal plan based on user inputs"""
    if allergies is None:
        allergies = []
    if preferences is None:
        preferences = []
    
    # Calculate BMI
    bmi = calculate_bmi(height, weight)
    bmi_category = get_bmi_category(bmi)
    
    # Calculate BMR and TDEE
    bmr = calculate_bmr(weight, height, age, gender)
    tdee = calculate_tdee(bmr, activity_level)
    
    # Adjust calories based on goal
    if goal == 'lose':
        daily_calories = tdee - 500  # Caloric deficit for weight loss
    elif goal == 'gain':
        daily_calories = tdee + 500  # Caloric surplus for weight gain
    else:
        daily_calories = tdee  # Maintenance
    
    # Calculate macronutrient distribution
    if goal == 'lose':
        protein_pct = 0.35  # Higher protein for weight loss
        fat_pct = 0.30
        carbs_pct = 0.35
    elif goal == 'gain':
        protein_pct = 0.30
        fat_pct = 0.25
        carbs_pct = 0.45  # Higher carbs for weight gain
    else:
        protein_pct = 0.30
        fat_pct = 0.30
        carbs_pct = 0.40
    
    # Calculate macros in grams
    protein_calories = daily_calories * protein_pct
    fat_calories = daily_calories * fat_pct
    carbs_calories = daily_calories * carbs_pct
    
    protein_grams = protein_calories / 4  # 4 calories per gram of protein
    fat_grams = fat_calories / 9         # 9 calories per gram of fat
    carbs_grams = carbs_calories / 4     # 4 calories per gram of carbs
    
    # Get recipe recommendations based on preferences and allergies
    recommended_recipes = recommend_recipes(allergies, preferences)
    
    # Create meal plan structure
    meal_types = ["Breakfast", "Lunch", "Dinner"]
    if meals_per_day > 3:
        meal_types.extend(["Snack 1", "Snack 2"][:meals_per_day-3])
    
    # Distribute calories across meals
    meal_calories = {}
    if meals_per_day == 3:
        meal_calories = {
            "Breakfast": daily_calories * 0.3,
            "Lunch": daily_calories * 0.4,
            "Dinner": daily_calories * 0.3
        }
    elif meals_per_day == 4:
        meal_calories = {
            "Breakfast": daily_calories * 0.25,
            "Lunch": daily_calories * 0.35,
            "Dinner": daily_calories * 0.3,
            "Snack 1": daily_calories * 0.1
        }
    elif meals_per_day == 5:
        meal_calories = {
            "Breakfast": daily_calories * 0.25,
            "Lunch": daily_calories * 0.3,
            "Dinner": daily_calories * 0.25,
            "Snack 1": daily_calories * 0.1,
            "Snack 2": daily_calories * 0.1
        }
    
    # Create a 7-day meal plan
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    meal_plan = {}
    
    # If we don't have enough recommended recipes, use the available ones multiple times
    if len(recommended_recipes) < len(days) * len(meal_types):
        # Duplicate recipes if needed
        while len(recommended_recipes) < len(days) * len(meal_types):
            recommended_recipes.extend(recommended_recipes[:5])
    
    recipe_index = 0
    for day in days:
        meal_plan[day] = {}
        for meal_type in meal_types[:meals_per_day]:
            if recipe_index < len(recommended_recipes):
                recipe = recommended_recipes[recipe_index]
                recipe_index += 1
                
                # Calculate approximate macros for this meal
                meal_protein = protein_grams * (meal_calories[meal_type] / daily_calories)
                meal_carbs = carbs_grams * (meal_calories[meal_type] / daily_calories)
                meal_fat = fat_grams * (meal_calories[meal_type] / daily_calories)
                
                meal_plan[day][meal_type] = {
                    "recipe": recipe["Name"],
                    "ingredients": recipe["Ingredients_name"],
                    "calories": round(meal_calories[meal_type]),
                    "protein": round(meal_protein),
                    "carbs": round(meal_carbs),
                    "fat": round(meal_fat)
                }
            else:
                # Fallback if we run out of recipes
                meal_plan[day][meal_type] = {
                    "recipe": f"Suggested {meal_type}",
                    "ingredients": "Based on your preferences",
                    "calories": round(meal_calories[meal_type]),
                    "protein": round(protein_grams * (meal_calories[meal_type] / daily_calories)),
                    "carbs": round(carbs_grams * (meal_calories[meal_type] / daily_calories)),
                    "fat": round(fat_grams * (meal_calories[meal_type] / daily_calories))
                }
    
    return {
        "bmi": bmi,
        "bmi_category": bmi_category,
        "daily_calories": round(daily_calories),
        "macros": {
            "protein": round(protein_grams),
            "carbs": round(carbs_grams),
            "fat": round(fat_grams)
        },
        "meal_plan": meal_plan
    }


@app.route('/get-allergies', methods=['GET'])
def get_allergies():
    print(f"Request received: {request.url}")
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email not provided'}), 400

    # 
    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'allergies': []}) 

    allergies = user.get('allergies', [])

    return jsonify({'allergies': allergies})


@app.route('/get-profile', methods=['GET'])
def get_profile():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'height': user.get('height'),
        'weight': user.get('weight'),
        'age': user.get('age'),
        'gender': user.get('gender'),
        'activityLevel': user.get('activityLevel'),
        'allergies': user.get('allergies', [])
    })



@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    email = data.get('email')

    preferences = data.get('preferences', [])

    if not email:
        return jsonify({'error': 'Email not provided'}), 400

    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    allergies = user.get('allergies', [])

    recommendations = recommend_recipes(allergies, preferences)
    return jsonify(recommendations)

@app.route('/diet-plan', methods=['POST'])
def diet_plan():
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        # Fetch user data from MongoDB
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Validate required profile fields
        required_fields = ['height', 'weight', 'age', 'gender', 'activityLevel']
        for field in required_fields:
            if field not in user or user[field] is None:
                return jsonify({'error': f'Complete your profile first (missing {field})'}), 400
        
        # Get preferences from request (convert string to array if needed)
        preferences = data.get('preferences', [])
        if isinstance(preferences, str):
            preferences = [p.strip() for p in preferences.split(',') if p.strip()]
        
        # Validate meals per day
        meals_per_day = int(data.get('meals_per_day', 3))
        if meals_per_day not in [3, 4, 5]:
            return jsonify({'error': 'Meals per day must be 3, 4, or 5'}), 400
        
        # Validate goal
        goal = data.get('goal', 'maintain').lower()
        if goal not in ['lose', 'maintain', 'gain']:
            return jsonify({'error': 'Invalid goal specified'}), 400
        
        # Generate diet plan
        plan = generate_meal_plan(
            height=float(user['height']),
            weight=float(user['weight']),
            age=int(user['age']),
            gender=user['gender'].lower(),
            activity_level=user['activityLevel'].lower(),
            goal=goal,
            allergies=user.get('allergies', []),
            preferences=preferences,
            meals_per_day=meals_per_day
        )
        
        return jsonify(plan)
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f"Failed to generate plan: {str(e)}"}), 500


@app.route('/nutritional-recommendation', methods=['POST'])
def nutrition_guide():
    data = request.json
    email = data.get('email')  # Need to send email from frontend
    
    # Fetch allergies from DB
    user = users_collection.find_one({'email': email})
    allergies = user.get('allergies', []) if user else []
    # console.log(allergies);
    print(allergies)
    target_nutrients = {k: v for k, v in {
        'calories': data.get('calories'),
        'protein': data.get('protein'),
        'carbs': data.get('carbs'),
        'fat': data.get('fat'),
        'fiber': data.get('fiber'),
        'sugar': data.get('sugar'),
        'sodium': data.get('sodium'),
        'cholesterol': data.get('cholesterol'),
        'saturated_fat': data.get('saturated_fat')
    }.items() if v is not None and v != ""}
    
    recommendations = get_nutrition_recommendations(
        target_nutrients,
        allergies,
        # data.get('allergies', []),
        data.get('preferences', []),
        data.get('num_recommendations', 5)
    )
    
    return jsonify(recommendations)




@app.route('/')
def home():
    return jsonify({"status": "ArogyaBite API is running", "version": "1.0.0"})


if __name__ == '__main__':
    app.run(debug=True)








