
import Tesseract from 'tesseract.js';
import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: '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', // Replace with your actual OpenAI API key
  
  dangerouslyAllowBrowser: true, 
});

export const extractTextFromImage = async (imageData) => {
  try {
    const result = await Tesseract.recognize(
      imageData,
      'eng', 
      { 
        logger: info => console.log(info) 
      }
    );
    
    // Check if extracted text is essentially empty
    const extractedText = result.data.text.trim();
    if (!extractedText || extractedText.length < 5) {
      throw new Error('No readable text found in the image. Please try with a clearer image of product ingredients.');
    }
    
    return extractedText;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error(error.message || 'Failed to extract text from image. Please ensure the image clearly shows ingredients text.');
  }
};

export const analyzeIngredients = async (ingredientText, userAllergies = []) => {
  try {
    
    
    // Enhanced mock analysis with better allergy detection
    const mockAnalysis = enhancedAnalyzeIngredients(ingredientText, userAllergies);
    
    // delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return mockAnalysis;
  } catch (error) {
    console.error('Analysis Error:', error);
    throw new Error('Failed to analyze ingredients. Please try again with a clearer image.');
  }
};

// Enhanced mock function for more realistic analysis
const enhancedAnalyzeIngredients = (ingredientText, userAllergies=[]) => {
  // Extract product and brand name
  let productName = 'food item';
  let brandName = '';
  const lowerText = ingredientText.toLowerCase();
  
  // extract product and brand names
  if (lowerText.includes('ingredients:')) {
    const beforeIngredients = ingredientText.split('ingredients:')[0].trim();
    if (beforeIngredients.length > 0 && beforeIngredients.length < 70) {
      const parts = beforeIngredients.split('\n').filter(part => part.trim().length > 0);
      if (parts.length >= 2) {
        brandName = parts[0].trim();
        productName = parts[1].trim();
      } else if (parts.length === 1) {
        productName = parts[0].trim();
      }
    }
  }
  
  // Extract ingredients - improved approach
  const extractedIngredients = ingredientText
    .replace(/ingredients:?/i, '')
    .split(/[,.;]/)
    .map(item => item.trim())
    .filter(item => item.length > 0 && item.match(/[a-zA-Z]/)); // Must contain at least one letter
  
  // Comprehensive allergen database with variants
  const allergenDatabase = {
    'dairy': {
      terms: ['milk', 'cream', 'butter', 'cheese', 'yogurt', 'whey', 'lactose', 'casein', 'dairy', 'milk protein', 'milk solids', 'buttermilk'],
      severity: 'high'
    },
    'eggs': {
      terms: ['egg', 'albumin', 'lysozyme', 'globulin', 'ovomucin', 'ovalbumin', 'egg white', 'egg yolk', 'mayonnaise'],
      severity: 'high'
    },
    'peanuts': {
      terms: ['peanut', 'arachis', 'groundnut', 'goober', 'monkey nut'],
      severity: 'high'
    },
    'tree nuts': {
      terms: ['almond', 'hazelnut', 'walnut', 'cashew', 'pecan', 'brazil nut', 'pistachio', 'macadamia', 'pine nut', 'chestnut'],
      severity: 'high'
    },
    'fish': {
      terms: ['fish', 'cod', 'salmon', 'trout', 'tuna', 'pollock', 'haddock', 'anchovy', 'bass', 'catfish', 'flounder', 'halibut', 'mahi', 'sardine', 'tilapia'],
      severity: 'high'
    },
    'shellfish': {
      terms: ['shellfish', 'crab', 'lobster', 'shrimp', 'prawn', 'crayfish', 'clam', 'mussel', 'oyster', 'scallop', 'squid', 'octopus'],
      severity: 'high'
    },
    'wheat': {
      terms: ['wheat', 'flour', 'bread', 'bran', 'starch', 'semolina', 'durum', 'spelt', 'farina', 'couscous', 'bulgur', 'seitan'],
      severity: 'medium'
    },
    'soy': {
      terms: ['soy', 'soya', 'tofu', 'edamame', 'miso', 'tempeh', 'textured vegetable protein', 'tvp', 'soy protein', 'soy lecithin'],
      severity: 'medium'
    },
    'sesame': {
      terms: ['sesame', 'tahini', 'sesame oil', 'sesame seed', 'benne', 'gingelly'],
      severity: 'medium'
    },
    'gluten': {
      terms: ['gluten', 'wheat', 'rye', 'barley', 'oats', 'spelt', 'kamut', 'triticale', 'farro', 'durum', 'semolina', 'graham'],
      severity: 'high'
    },
    'mustard': {
      terms: ['mustard', 'mustard seed', 'mustard powder', 'dijon', 'wasabi'],
      severity: 'medium'
    },
    'celery': {
      terms: ['celery', 'celery seed', 'celery salt', 'celeriac'],
      severity: 'medium'
    },
    'lupin': {
      terms: ['lupin', 'lupine', 'lupin flour', 'lupini'],
      severity: 'medium'
    },
    'molluscs': {
      terms: ['mollusc', 'oyster', 'mussel', 'clam', 'scallop', 'snail', 'squid', 'octopus', 'cuttlefish'],
      severity: 'high'
    },
    'sulfites': {
      terms: ['sulfite', 'sulphite', 'metabisulfite', 'sulfur dioxide', 'so2', 'preservative'],
      severity: 'low'
    }
  };
  
  // Additives database - classified by health concerns
  const additivesDatabase = {
    high_concern: [
      'sodium nitrite', 'sodium nitrate', 'bha', 'bht', 'tbhq', 'potassium bromate', 'propyl gallate',
      'brilliant blue', 'red 40', 'red 3', 'yellow 5', 'yellow 6', 'blue 1', 'blue 2', 'green 3',
      'brominated vegetable oil', 'propylene glycol', 'butylated', 'carrageenan', 'partially hydrogenated',
      'msg', 'monosodium glutamate', 'aspartame', 'acesulfame', 'saccharin', 'high fructose corn syrup'
    ],
    medium_concern: [
      'caramel color', 'soy lecithin', 'corn syrup', 'maltodextrin', 'dextrose', 'guar gum', 'xanthan gum',
      'natural flavors', 'artificial flavors', 'modified food starch', 'sodium benzoate', 'potassium sorbate',
      'calcium disodium edta', 'sodium phosphate', 'artificial sweetener', 'polysorbate', 'annatto'
    ],
    low_concern: [
      'vitamin e', 'tocopherol', 'ascorbic acid', 'citric acid', 'lactic acid', 'calcium chloride',
      'pectin', 'beetroot extract', 'beta carotene', 'cinnamon extract', 'turmeric extract', 
      'rosemary extract', 'sea salt', 'himalayan salt'
    ]
  };
  
  // Healthy ingredients database
  const healthyIngredientsDatabase = [
    'whole grain', 'organic', 'natural', 'vitamin', 'mineral', 'fiber', 'protein',
    'antioxidant', 'probiotic', 'prebiotic', 'omega-3', 'unsweetened', 'quinoa',
    'chia', 'flax', 'legume', 'lentil', 'bean', 'vegetable', 'fruit', 'nuts',
    'seeds', 'olive oil', 'avocado oil', 'coconut oil', 'turmeric', 'ginger',
    'spinach', 'kale', 'broccoli', 'carrot', 'sweet potato', 'tomato', 'garlic',
    'onion', 'berry', 'apple', 'citrus', 'whole food'
  ];
  
  // Find allergens in ingredients based on user's allergies
  const normalizedUserAllergies = userAllergies.map(a => a.toLowerCase());
  const flaggedAllergens = [];
  let allergensFound = false;
  
  // if (userAllergies.length > 0) {
  //   userAllergies.forEach(allergy => {
  //     const allergyLower = allergy.toLowerCase();
      
  //     // Check if this allergy is in our database
  //     Object.keys(allergenDatabase).forEach(allergenType => {
  //       if (allergenType.includes(allergyLower) || allergyLower.includes(allergenType)) {
  //         const allergenInfo = allergenDatabase[allergenType];
          
  //         // Check all terms for this allergen
  //         allergenInfo.terms.forEach(term => {
  //           // Look for the term in all ingredients and the raw text
  //           if (lowerText.includes(term) || 
  //               extractedIngredients.some(ing => ing.toLowerCase().includes(term))) {
              
  //             // Check if we already found this allergen
  //             if (!flaggedAllergens.some(a => a.name.includes(term))) {
  //               flaggedAllergens.push({
  //                 name: term,
  //                 associatedWith: allergenType,
  //                 severity: allergenInfo.severity
  //               });
  //               allergensFound = true;
  //             }
  //           }
  //         });
  //       }
  //     });
  //   });
  // }
  
  if (normalizedUserAllergies.length > 0) {
    // First check if any user allergy matches a known allergen category
    normalizedUserAllergies.forEach(userAllergy => {
      // Find matching allergen categories
      const matchingCategories = Object.keys(allergenDatabase).filter(
        allergenType => allergenType.toLowerCase().includes(userAllergy) || 
                      userAllergy.includes(allergenType.toLowerCase())
      );

      // Check each matching category
      matchingCategories.forEach(category => {
        const allergenInfo = allergenDatabase[category];
        
        // Check all terms for this allergen
        allergenInfo.terms.forEach(term => {
          // Create case-insensitive regex pattern
          const pattern = new RegExp(`\\b${term}\\b`, 'i');
          
          // Check both the full text and individual ingredients
          if (pattern.test(ingredientText)) {
            // Check if we already found this allergen
            const alreadyFound = flaggedAllergens.some(a => 
              a.name.toLowerCase() === term.toLowerCase()
            );
            
            if (!alreadyFound) {
              flaggedAllergens.push({
                name: term,
                associatedWith: category,
                severity: allergenInfo.severity
              });
              allergensFound = true;
            } else {
              // Still mark as found even if it's a duplicate
              allergensFound = true;
            }
          }
        });
      });
    });
  }
  // Identify additives
  const foundAdditives = [];
  
  // Check high concern additives
  additivesDatabase.high_concern.forEach(additive => {
    if (lowerText.includes(additive)) {
      foundAdditives.push({
        name: additive,
        concern: 'high'
      });
    }
  });
  
  // Check medium concern additives
  additivesDatabase.medium_concern.forEach(additive => {
    if (lowerText.includes(additive)) {
      foundAdditives.push({
        name: additive,
        concern: 'medium'
      });
    }
  });
  
  // Check for E-numbers (food additives)
  const eNumberRegex = /\b[Ee][-\s]?\d{3}[a-z]?\b/g;
  const eNumbers = lowerText.match(eNumberRegex);
  if (eNumbers) {
    eNumbers.forEach(enumber => {
      foundAdditives.push({
        name: enumber,
        concern: 'medium' // Default concern level for E-numbers
      });
    });
  }
  
  // Calculate health score (enhanced algorithm)
  let healthScore = 50; // Start at neutral
  
  // Check for healthy ingredients
  let healthyIngredientsCount = 0;
  healthyIngredientsDatabase.forEach(term => {
    if (lowerText.includes(term)) {
      healthScore += 3;
      healthyIngredientsCount++;
    }
  });
  
  // Penalize for additives
  let highConcernCount = 0;
  let mediumConcernCount = 0;
  
  foundAdditives.forEach(additive => {
    if (additive.concern === 'high') {
      healthScore -= 8;
      highConcernCount++;
    } else if (additive.concern === 'medium') {
      healthScore -= 4;
      mediumConcernCount++;
    } else {
      healthScore -= 1;
    }
  });
  
  // Adjust score based on length (more ingredients typically means more processed)
  if (extractedIngredients.length > 7) {
    healthScore -= Math.min(20, (extractedIngredients.length - 7) * 1.5);
  }
  
  // Bonus for short ingredient lists (less processed)
  if (extractedIngredients.length <= 5) {
    healthScore += 10;
  }
  
  // Special cases
  if (lowerText.includes('organic') && !lowerText.includes('non-organic')) {
    healthScore += 5;
  }
  
  if (lowerText.includes('whole grain') || lowerText.includes('whole wheat')) {
    healthScore += 5;
  }
  
  if (lowerText.includes('non-gmo') || lowerText.includes('no gmo')) {
    healthScore += 3;
  }
  
  // Allergen penalty
  if (flaggedAllergens.length > 0) {
    // Severe penalty if user has allergies and they're found
    healthScore -= Math.min(20, flaggedAllergens.length * 7);
  }
  
  // Major red flags that severely impact health score
  const redFlags = [
    'partially hydrogenated', 'hydrogenated', 'trans fat', 'high fructose',
    'artificial color', 'artificial flavour', 'artificial flavor'
  ];
  
  redFlags.forEach(flag => {
    if (lowerText.includes(flag)) {
      healthScore -= 15;
    }
  });
  
  // Ensure score stays within bounds
  healthScore = Math.max(5, Math.min(100, healthScore));
  
  // Prepare simple ingredients list for display
  const simplifiedIngredients = extractedIngredients.map(ing => {
    let isAllergen = false;
    let isAdditive = false;
    
    // Check if this ingredient contains an allergen
    flaggedAllergens.forEach(allergen => {
      if (ing.toLowerCase().includes(allergen.name)) {
        isAllergen = true;
      }
    });
    
    // Check if this ingredient is an additive
    foundAdditives.forEach(additive => {
      if (ing.toLowerCase().includes(additive.name)) {
        isAdditive = true;
      }
    });
    
    return {
      name: ing,
      isAllergen,
      isAdditive
    };
  });
  
  // Generate AI comment based on analysis
  let aiComment = '';
  
  if (healthScore < 30) {
    aiComment = 'This product contains several concerning ingredients that may contribute to health issues with regular consumption.';
    
    if (highConcernCount > 0) {
      aiComment += ` Found ${highConcernCount} high-concern additives.`;
    }
    
    if (redFlags.some(flag => lowerText.includes(flag))) {
      aiComment += ' Contains ingredients strongly associated with negative health effects.';
    }
  } else if (healthScore < 60) {
    aiComment = 'This product has some questionable ingredients, but is acceptable for occasional consumption.';
    
    if (mediumConcernCount > 0) {
      aiComment += ` Contains ${mediumConcernCount} additives of moderate concern.`;
    }
  } else if (healthScore < 80) {
    aiComment = 'This product has a fairly good nutritional profile with minimal concerning ingredients.';
    
    if (healthyIngredientsCount > 0) {
      aiComment += ` Contains ${healthyIngredientsCount} beneficial ingredients.`;
    }
  } else {
    aiComment = 'This product appears to have a high-quality ingredient list with minimal processing.';
    
    if (lowerText.includes('organic')) {
      aiComment += ' Organically sourced ingredients provide additional health benefits.';
    }
  }
  
  // Add allergies-specific comment if needed
  if (flaggedAllergens.length > 0) {
    const highSeverityCount = flaggedAllergens.filter(a => a.severity === 'high').length;
    
    if (highSeverityCount > 0) {
      aiComment += ` Contains ${highSeverityCount} high-severity allergens that may cause serious reactions.`;
    } else {
      aiComment += ` Contains allergens that may trigger your allergic reactions.`;
    }
  }
  console.log('User allergies:', userAllergies);
console.log('Found allergens:', flaggedAllergens);
console.log('isSafe:', flaggedAllergens.length === 0);

  // Format additives for display
  const formattedAdditives = foundAdditives.map(a => ({
    name: a.name,
    concern: a.concern
  }));
  
  // Prepare final response
  return {
    productName,
    brandName,
    score: Math.round(healthScore),
    ingredients: simplifiedIngredients.map(i => i.name),
    allergies: flaggedAllergens,
    additives: formattedAdditives,
    // isSafe: !allergensFound,
    isSafe: flaggedAllergens.length === 0, 
    aiComment
  };
}; 