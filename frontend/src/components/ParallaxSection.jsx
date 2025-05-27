"use client"

import { useEffect, useRef, useState } from "react"

const ParallaxSection = ({
  children,
  bgImage,
  speed = 0.5,
  className = "",
  overlay = true,
  overlayColor = "rgba(0, 0, 0, 0.4)",
  height = "h-[500px]",
}) => {
  const [offsetY, setOffsetY] = useState(0)
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const isInView = rect.top < window.innerHeight && rect.bottom > 0

        if (isInView) {
          setIsVisible(true)
          setOffsetY(window.pageYOffset)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const parallaxStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    transform: isVisible ? `translateY(${offsetY * speed}px)` : "none",
  }

  const overlayStyle = overlay
    ? {
        backgroundColor: overlayColor,
      }
    : {}

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${height} ${className}`}>
      <div className="absolute inset-0 transition-transform duration-300 ease-out" style={parallaxStyle}></div>
      {overlay && <div className="absolute inset-0" style={overlayStyle}></div>}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}

export default ParallaxSection
