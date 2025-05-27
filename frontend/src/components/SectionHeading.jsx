const SectionHeading = ({
  title,
  subtitle,
  centered = false,
  titleClassName = "",
  subtitleClassName = "",
  className = "",
}) => {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""} ${className}`}>
      <h2 className={`heading-lg mb-4 ${titleClassName}`}>{title}</h2>
      {subtitle && (
        <p className={`text-lg text-gray-600 max-w-3xl ${centered ? "mx-auto" : ""} ${subtitleClassName}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeading
