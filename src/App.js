/* eslint-disable react/react-in-jsx-scope */
import { Route, Routes } from "react-router"
import { BrowserRouter } from "react-router-dom"
import LoginForm from "./frontend/components/Login Page/LoginForm"
import SignUpForm from "./frontend/components/Sign Up Page/SignUpForm"
import CreateYourProfile from "./frontend/components/Sign Up Page/CreateYourProfile"
import Home from "./frontend/components/Home Page/Home"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signup/:id" element={<CreateYourProfile />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
