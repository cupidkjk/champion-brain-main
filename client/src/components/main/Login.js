import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import "../../styles/main/form.scss";
import { updateAlert } from "../../reducers/mainSlice";
import urls from "../../utils/urls";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();

	const handleLogin = async (event) => {
		event.preventDefault();
		if (!username || !password)
			return dispatch(updateAlert("Fill all the fields"));
		const response = await axios.post(
			urls.login,
			{ username, password },
			{ withCredentials: true }
		);
		if (response.data.success) window.location.reload();
		else dispatch(updateAlert(response.data.body.message));
	};

	return (
		<div className="form-container">
			<form>
				<div className="form-field">
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={({ target: { value } }) => setUsername(value)}
					/>
				</div>
				<div className="form-field">
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={({ target: { value } }) => setPassword(value)}
					/>
				</div>
				<div className="form-field">
					<input type="submit" value="Login" onClick={handleLogin} />
				</div>
				<div className="form-field">
					<Link to="/signup">
						Don't have an account yet? <span>Sign up</span>
					</Link>
				</div>
			</form>
		</div>
	);
};

export default Login;