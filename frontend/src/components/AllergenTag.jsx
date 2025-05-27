//import { cn } from "@/lib/utils"
import { cn } from "../lib/utils"
const AllergenTag = ({ name, severity, className }) => {
  const getSeverityColor = () => {
    switch (severity) {
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getSeverityColor(),
        className,
      )}
    >
      {name}
    </span>
  )
}

export default AllergenTag