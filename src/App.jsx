import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Signup from "./components/Signup";
import Singin from "./components/Signin";
import Signin from "./components/Signin";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Signin />} />
      </Routes>
    </>
  );
}

export default App;
