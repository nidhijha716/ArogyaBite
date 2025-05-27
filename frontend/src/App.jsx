// "use client"

// import { useState } from "react"
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
// import Navbar from "./components/Navbar"
// import Footer from "./components/Footer"
// import ScrollToTop from "./components/ScrollToTop"


// import Home from "./pages/Home"
// import AboutUs from "./pages/AboutUs"
// import Contact from "./pages/Contact"
// import NotFound from "./pages/NotFound"

// import RecipeRecommendation from "./components/RecipeRecommendation" 
// import Login from "./components/Login"
// import Register from './components/Register'
// import ProfileForm from './components/ProfileForm';
// import ProtectedRoute from './components/ProtectedRoute';
// import OcrScanner from './components/OcrScanner'
// // import NutritionGuide from "./components/NutritionGuide"
// import DietPlanner from "./components/DietPlanner"
// import NutritionGuide from "./components/NutritionGuide"


// function App() {
//   const [user, setUser ] = useState(null)

  
//   const handleLogout = () => {
//     localStorage.clear(); 
//     setUser(null);
//   };
  

//   return (
//     <Router>
//       <ScrollToTop />
//       <div className="flex flex-col min-h-screen">
//         <Navbar user={user} onLogout={handleLogout} />
//         <main className="flex-grow">
//           <Routes>
//             {/* Public routes */}
//             <Route path="/home" element={<Home />} /> 
//             <Route path="/about" element={<AboutUs />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/recommend" element={<RecipeRecommendation />} /> 
//             <Route path="/diet-recommendation" element={<DietPlanner />} />
//             <Route path="/nutritional-recommendation" element={<NutritionGuide />} />

//             <Route path="/" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/profile" element={<ProfileForm />} />
//             <Route path="/ocr" element={<OcrScanner />} />



//             {/* 404 fallback */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   )
// }

// export default App





"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"

import Home from "./pages/Home"
import AboutUs from "./pages/AboutUs"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"

import RecipeRecommendation from "./components/RecipeRecommendation"
import Login from "./components/Login"
import Register from './components/Register'
import ProfileForm from './components/ProfileForm'
import ProtectedRoute from './components/ProtectedRoute'
import OcrScanner from './components/OcrScanner'
import DietPlanner from "./components/DietPlanner"
import NutritionGuide from "./components/NutritionGuide"

function App() {
  const [user, setUser] = useState(null)

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/recommend"
              element={<ProtectedRoute element={RecipeRecommendation} />}
            />
            <Route
              path="/diet-recommendation"
              element={<ProtectedRoute element={DietPlanner} />}
            />
            <Route
              path="/nutritional-recommendation"
              element={<ProtectedRoute element={NutritionGuide} />}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute element={ProfileForm} />}
            />
            <Route
              path="/ocr"
              element={<ProtectedRoute element={OcrScanner} />}
            />

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App









// "use client"

// import { useState } from "react"
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate
// } from "react-router-dom"

// import Navbar from "./components/Navbar"
// import Footer from "./components/Footer"
// import ScrollToTop from "./components/ScrollToTop"

// import Home from "./pages/Home"
// import AboutUs from "./pages/AboutUs"
// import Contact from "./pages/Contact"
// import NotFound from "./pages/NotFound"

// import RecipeRecommendation from "./components/RecipeRecommendation"
// import Login from "./components/Login"
// import Register from "./components/Register"
// import ProfileForm from "./components/ProfileForm"
// import OcrScanner from "./components/OcrScanner"
// import DietPlanner from "./components/DietPlanner"
// import NutritionGuide from "./components/NutritionGuide"

// function App() {
//   const [user, setUser] = useState(null)

//   const handleLogout = () => {
//     localStorage.clear()
//     setUser(null)
//   }

//   return (
//     <Router>
//       <ScrollToTop />
//       <div className="flex flex-col min-h-screen">
//         <Navbar user={user} onLogout={handleLogout} />
//         <main className="flex-grow">
//           <Routes>
//             {/* Public routes */}
//             <Route path="/" element={<Home />} />
//             <Route path="/home" element={<Home />} />
//             <Route path="/about" element={<AboutUs />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//             {/* Feature and profile routes */}
//             <Route path="/recommend" element={<RecipeRecommendation />} />
//             <Route path="/diet-recommendation" element={<DietPlanner />} />
//             <Route path="/nutritional-recommendation" element={<NutritionGuide />} />
//             <Route path="/profile" element={<ProfileForm />} />
//             <Route path="/ocr" element={<OcrScanner />} />

//             {/* 404 fallback */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   )
// }

// export default App
