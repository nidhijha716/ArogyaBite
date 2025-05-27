import { Navigate, useLocation } from "react-router-dom"

const ProtectedRoute = ({ element: Element }) => {
  const isLoggedIn = !!localStorage.getItem("email")
  const location = useLocation()

  return isLoggedIn ? (
    <Element />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default ProtectedRoute
