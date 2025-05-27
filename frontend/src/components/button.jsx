"use client"

const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"

  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "bg-transparent hover:bg-emerald-50 text-emerald-600 border border-emerald-500 py-2 px-6 rounded-lg",
    text: "bg-transparent text-emerald-600 hover:text-emerald-700 py-2 px-4",
  }

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : ""

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
