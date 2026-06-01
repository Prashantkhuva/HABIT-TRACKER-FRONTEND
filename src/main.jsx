import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import CustomCursor from "./components/CustomCursor";
import { Analytics } from "@vercel/analytics/react";
import {
  LandingPage,
  LoginPage,
  SignupPage,
  HabitsPage,
  HabitDetailPage,
  StatisticsPage,
  Settings,
  EditProfilePage,
} from "./Pages/index.js";
import AuthLayout from "./components/AuthLayout.jsx";
import { DashPage } from "./Pages/index.js";
import Create from "./components/Habit/Create.jsx";
import HelpPage from "./Pages/HelpPage.jsx";
import ChangePasswordModal from "./components/ChangePasswordModal.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: (
          <AuthLayout authentication={false}>
            <LandingPage />
          </AuthLayout>
        ),
      },
      {
        path: "/signin",
        element: (
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <SignupPage />
          </AuthLayout>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <AuthLayout authentication>
            <DashPage />
          </AuthLayout>
        ),
      },
      {
        path: "/create-habit",
        element: (
          <AuthLayout authentication>
            <Create />
          </AuthLayout>
        ),
      },
      {
        path: "/rituals",
        element: (
          <AuthLayout authentication>
            <HabitsPage />
          </AuthLayout>
        ),
      },
      {
        path: "/rituals/completed",
        element: (
          <AuthLayout authentication>
            <HabitsPage />
          </AuthLayout>
        ),
      },
      {
        path: "/rituals/active",
        element: (
          <AuthLayout authentication>
            <HabitsPage />
          </AuthLayout>
        ),
      },
      {
        path: "/rituals/:id",
        element: (
          <AuthLayout authentication>
            <HabitDetailPage />
          </AuthLayout>
        ),
      },
      {
        path: "/statistics",
        element: (
          <AuthLayout authentication>
            <StatisticsPage />
          </AuthLayout>
        ),
      },
      {
        path: "/help",
        element: (
          <AuthLayout authentication>
            <HelpPage />
          </AuthLayout>
        ),
      },
      {
        path: "/settings",
        element: (
          <AuthLayout authentication>
            <Settings />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <AuthLayout authentication>
            <EditProfilePage />
          </AuthLayout>
        ),
      },
      {
        path: "/change-password",
        element: (
          <AuthLayout authentication>
            <ChangePasswordModal />
          </AuthLayout>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-black">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      <p className="font-display text-sm uppercase tracking-widest text-neutral-400">
        Loading editor...
      </p>
    </div>
  </div>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<PageLoader />}>
        <CustomCursor />
        <Analytics />
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </StrictMode>,
);
