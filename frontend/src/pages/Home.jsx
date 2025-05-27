import { Link } from "react-router-dom"
import { ChevronRight, Utensils, ScanLine, Apple, Salad } from "lucide-react"
import Button from "../components/Button"
import FAQ from "../components/FAQ"

const Home = () => {
  return (
    <div>
      
      <section className="bg-black text-white min-h-screen pt-20">
        <div className="container-custom h-full grid grid-cols-1 lg:grid-cols-2 gap-8 py-12">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Safe Eating <br />
              with ArogyaBite
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              ArogyaBite offers intelligent tools to support your dietary needs—scan food labels to detect allergens,
              get nutritional insights, or generate personalized meal plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/about">
                <Button variant="outline" className="text-white border-white hover:bg-white/10 rounded-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <img src="/pic4.jpg" alt="People using ArogyaBite" className="rounded-lg" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4">
                <h3 className="text-white font-bold">Your Safety Matters</h3>
                <p className="text-gray-300 text-sm">Stay informed about your food choices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-16 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our comprehensive suite of tools designed to help you make informed food choices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* OCR Label Recognition */}
            <Link to="/ocr" className="group">
              <div className="bg-gray-800 hover:bg-gray-700 rounded-xl p-8 text-center h-full flex flex-col transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
                <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ScanLine size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-orange-400 transition-colors">
                  OCR Label Recognition
                </h3>
                <p className="text-gray-300 mb-6 flex-grow">
                  Scan food labels to instantly identify allergens and potential health risks.
                </p>
                <div className="mt-auto">
                  <Button
                    variant="primary"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full"
                  >
                    Scan Now
                  </Button>
                </div>
              </div>
            </Link>

            {/* Recipe Recommendation */}
            <Link to="/recommend" className="group">
              <div className="bg-gray-800 hover:bg-gray-700 rounded-xl p-8 text-center h-full flex flex-col transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
                <div className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Utensils size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">
                  Recipe Recommendation
                </h3>
                <p className="text-gray-300 mb-6 flex-grow">
                  Get personalized recipe suggestions based on your dietary preferences and allergies.
                </p>
                <div className="mt-auto">
                  <Button
                    variant="primary"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
                  >
                    Find Recipes
                  </Button>
                </div>
              </div>
            </Link>

            {/* Diet Recommendation */}
            <Link to="/diet-recommendation" className="group">
              <div className="bg-gray-800 hover:bg-gray-700 rounded-xl p-8 text-center h-full flex flex-col transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Apple size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                  Diet Recommendation
                </h3>
                <p className="text-gray-300 mb-6 flex-grow">
                  Receive customized diet plans that avoid your allergens and meet your nutritional needs.
                </p>
                <div className="mt-auto">
                  <Button variant="primary" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                    Plan Your Diet
                  </Button>
                </div>
              </div>
            </Link>

            {/* Nutritional Food Recommendation */}
            <Link to="/nutritional-recommendation" className="group">
              <div className="bg-gray-800 hover:bg-gray-700 rounded-xl p-8 text-center h-full flex flex-col transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
                <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Salad size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                Nutrition-Based Food Guide
                </h3>
                <p className="text-gray-300 mb-6 flex-grow">
                Get food recommendations based on your dietary preferences and nutritional goals.

                </p>
                <div className="mt-auto">
                  <Button
                    variant="primary"
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-full"
                  >
                    Get Recommendation
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {/* <section className="bg-white py-20">
        <div className="container-custom">
          <div className="text-center mb-4">
            <span className="text-gray-700 font-medium">Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">How ArogyaBite Works for You</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16">
            ArogyaBite simplifies allergen detection and nutritional planning with a user-friendly platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-4">
                <ScanLine className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Scan Food Labels</h3>
              <p className="text-gray-600">Upload images of food labels for instant allergen detection.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4">
                <Utensils className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Get Recipe Ideas</h3>
              <p className="text-gray-600">Discover recipes tailored to your dietary preferences and restrictions.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4">
                <Apple className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Personalized Diet Plans</h3>
              <p className="text-gray-600">Receive customized diet recommendations based on your health profile.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mx-auto mb-4">
                <Salad className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Find Food Alternatives</h3>
              <p className="text-gray-600">Discover nutritionally similar alternatives to foods you can't eat.</p>
            </div>
          </div>
        </div>
      </section> */}

      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-4">
            <span className="text-gray-700 font-medium">Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Why Choose ArogyaBite</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16">
            ArogyaBite empowers you to make informed food choices with our comprehensive suite of tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-orange-500">OCR Label Recognition</h3>
              <p className="text-gray-600 mb-6">
                Our advanced OCR technology accurately scans food labels to identify potential allergens and health
                risks. Simply upload an image of a food label, and our AI will analyze the ingredients for you.
              </p>
              <Link to="/ocr">
                <Button variant="primary" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                  Try Label Scanning <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-emerald-500">Recipe Recommendation</h3>
              <p className="text-gray-600 mb-6">
                Discover delicious recipes tailored to your dietary needs. Our AI analyzes your preferences and
                restrictions to suggest meals that are both safe and satisfying, taking the guesswork out of meal
                planning.
              </p>
              <Link to="/recommend">
                <Button variant="primary" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full">
                  Explore Recipes <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-blue-500">Diet Recommendation</h3>
              <p className="text-gray-600 mb-6">
              Get personalized diet plans generated based on your BMI. Our system provides balanced meal recommendations tailored to your body type and health goals.
              </p>
              <Link to="/diet-recommendation">
                <Button variant="primary" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                  Get Diet Plan <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-purple-500">Nutritional Alternatives</h3>
              <p className="text-gray-600 mb-6">
                Find safe and nutritious alternatives to foods you can't eat due to allergies or dietary restrictions.
                Our system suggests substitutes that match the nutritional profile of your original choices.
              </p>
              <Link to="/nutritional-recommendation">
                <Button variant="primary" className="bg-purple-500 hover:bg-purple-600 text-white rounded-full">
                Show Food Picks<ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black text-white">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-6">FAQs</h2>
          <p className="text-center text-gray-300 max-w-3xl mx-auto mb-12">
            Find answers to your questions about ArogyaBite and how to use its features.
          </p>

          <div className="max-w-3xl mx-auto">
            <FAQ
              items={[
                {
                  question: "How does the OCR label scanning work?",
                  answer:
                    "Our OCR technology scans food labels and extracts ingredient information. The AI then analyzes this data to identify potential allergens based on your profile, helping you make informed dietary choices.",
                },
                {
                  question: "How accurate are the recipe recommendations?",
                  answer:
                    "Our recipe recommendations are based on your specified dietary preferences and restrictions. The system uses advanced algorithms to suggest meals that avoid your allergens while meeting your nutritional needs.",
                },
                {
                  question: "Can I customize my diet recommendations?",
                  answer:
                    "Yes! Our diet recommendation tool allows you to specify health conditions, allergies, and dietary preferences. The system then generates a personalized diet plan tailored to your specific needs.",
                },
                {
                  question: "How do I find nutritional alternatives?",
                  answer:
                    "Simply select the foods you can't eat due to allergies or restrictions, and our system will suggest nutritionally similar alternatives that are safe for you to consume.",
                },
                {
                  question: "Is my health information secure?",
                  answer:
                    "Yes, we take data privacy seriously. All your health information and dietary preferences are securely stored and used only to provide you with personalized recommendations.",
                },
              ]}
            />
          </div>

          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-gray-300 mb-8">We're here to help you with any inquiries.</p>
            <Link to="/contact">
              <Button variant="primary" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home