import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Signinpage from "./Pages/LoginPage";
import Signuppage from "./Pages/SignupPage";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Signinpage />} />
      </Routes>
    </>
  );
}

export default App;
