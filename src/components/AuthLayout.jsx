import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthFormSkeleton } from "./loading/LoadingSkeletons";

// function AuthLayout({ children, authentication = true }) {
//   const navigate = useNavigate();
//   const authStatus = useSelector((state) => state.auth.status);
//   const isAuthorizedRoute = authentication ? authStatus : !authStatus;

//   useEffect(() => {
//     if (authentication && authStatus !== authentication) {
//       navigate("/signin");
//     } else if (!authentication && authStatus !== authentication) {
//       navigate("/");
//     }
//   }, [authStatus, navigate, authentication]);

//   return isAuthorizedRoute ? <>{children}</> : <AuthFormSkeleton />;
// }

function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();

  const { status, isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthChecked) return; // 👈 WAIT

    if (authentication && !status) {
      navigate("/signin");
    } else if (!authentication && status) {
      navigate("/dashboard");
    }
  }, [status, isAuthChecked, navigate, authentication]);

  // 👇 jab tak check nahi hua, kuch mat dikhao ya skeleton
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
export default AuthLayout;
