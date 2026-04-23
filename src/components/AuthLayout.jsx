import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthFormSkeleton from "./loading/LoadingSkeletons";

function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const isAuthorizedRoute = authentication ? authStatus : !authStatus;

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
  }, [authStatus, navigate, authentication]);

  return isAuthorizedRoute ? <>{children}</> : <AuthFormSkeleton />;
}

export default AuthLayout;
