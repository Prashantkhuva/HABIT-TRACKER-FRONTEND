import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  const { status: authStatus, isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthChecked) return;

    if (authentication && !authStatus) {
      navigate("/signin", { replace: true });
    } else if (!authentication && authStatus) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthChecked, authStatus, navigate, authentication]);

  if (!isAuthChecked) return null;

  return <>{children}</>;
}
  export default AuthLayout;
