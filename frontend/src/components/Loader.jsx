const Loader = ({ size = "medium", color = "emerald" }) => {
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  const colorClasses = {
    emerald: "border-emerald-500",
    teal: "border-teal-500",
    white: "border-white",
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-t-transparent rounded-full animate-spin ${colorClasses[color]}`}
      ></div>
    </div>
  )
}

export default Loader
