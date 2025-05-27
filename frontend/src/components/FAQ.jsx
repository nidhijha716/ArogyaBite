"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const FAQ = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0)

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border-b border-gray-700 pb-4">
          <button
            className="flex justify-between items-center w-full text-left py-4 focus:outline-none"
            onClick={() => toggleItem(index)}
          >
            <h3 className="text-lg font-medium">{item.question}</h3>
            {openIndex === index ? (
              <ChevronUp className="h-5 w-5 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-5 w-5 flex-shrink-0" />
            )}
          </button>
          {openIndex === index && (
            <div className="mt-2 text-gray-300">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default FAQ
