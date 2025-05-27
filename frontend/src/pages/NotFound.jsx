"use client"

import { Link } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"
import Button from "../components/Button"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-emerald-500">404</h1>
        <h2 className="text-3xl font-bold mt-4 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
