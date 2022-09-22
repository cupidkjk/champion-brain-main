import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ path, children }) => {
	const { isLoggedIn } = useSelector((state) => state.main);

	if (isLoggedIn) return children;
	return <Navigate to={path} />;
};

export default ProtectedRoute;