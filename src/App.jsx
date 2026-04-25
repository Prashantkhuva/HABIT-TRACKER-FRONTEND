import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { Outlet, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Signinpage from "./Pages/LoginPage";
import Signuppage from "./Pages/SignupPage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthChecked, signin } from "./store/authSlice";
import { getCurrentUser } from "./api/auth-api";

function App() {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  const location = useLocation();

  const hideHeaderOn = ["/", "/signin", "/signup", "/verify-email"];
  const shouldHide = hideHeaderOn.includes(location.pathname);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();

        const user = res?.data?.data;

        if (user) {
          dispatch(signin({ userData: user }));
        } else {
          dispatch(setAuthChecked());
        }
      } catch (error) {
        dispatch(setAuthChecked());
      }
    };

    checkAuth();
  }, [dispatch]);
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {!shouldHide && <Header />}
      <main className={`grow ${!shouldHide ? "pt-20 pl-56" : ""}`}>
        <Outlet />
      </main>
      {/* {!shouldHide && <Footer />} */}
      {!shouldHide && <Sidebar />}
    </div>
  );
}

export default App;
