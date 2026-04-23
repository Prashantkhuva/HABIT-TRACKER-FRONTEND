import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { Outlet, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Signinpage from "./Pages/LoginPage";
import Signuppage from "./Pages/SignupPage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  const location = useLocation();

  const hideHeaderOn = ["/", "/signin", "/signup", "/verify-email"];
  const shouldHide = hideHeaderOn.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {!shouldHide && <Header />}
      <main className={`grow ${!shouldHide ? "pt-20" : ""}`}>
        <Outlet />
      </main>
      {/* {!shouldHide && <Footer />} */}
    </div>
  );
}

export default App;
