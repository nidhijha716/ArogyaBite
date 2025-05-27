import { ScanLine, ShieldAlert, BarChart3, Utensils } from "lucide-react"

const features = [
  {
    title: "Real-time OCR Scanning",
    description: "Instantly scan food labels and ingredients using advanced optical character recognition technology.",
    icon: ScanLine,
  },
  {
    title: "Personalized Allergen Detection",
    description: "Identify potential allergens based on your specific dietary restrictions and sensitivities.",
    icon: ShieldAlert,
  },
  {
    title: "AI Risk Scoring",
    description: "Get a comprehensive risk assessment score for each food item based on your personal health profile.",
    icon: BarChart3,
  },
  {
    title: "Food Recommendations",
    description: "Receive personalized alternative food suggestions that are safe for your dietary needs.",
    icon: Utensils,
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Key Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ArogyaBite uses cutting-edge AI technology to help you make safer food choices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform transition-transform"
            >
              <div className="text-emerald-600 mb-4">
                <feature.icon size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
