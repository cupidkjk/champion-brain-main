import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { updateAlert } from "../../reducers/mainSlice";
import countriesJson from "../../utils/countries.json";
import "../../styles/main/form.scss";
import urls from "../../utils/urls";

const Signup = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [country, setCountry] = useState("");
	const [showCountryList, setShowCountryList] = useState(false);
	const [countries, setCountries] = useState(countriesJson);
	const dispatch = useDispatch();

	const signup = async (event) => {
		event.preventDefault();
		if (!email || !username || !password || !confirmPassword || !country) {
			dispatch(updateAlert("Fill all the fields"));
			return;
		}
		const response = await axios.post(
			urls.signup,
			{
				email,
				username,
				password,
				confirmPassword,
				country,
			},
			{ withCredentials: true }
		);
		if (response.data.success) window.location.reload();
		else dispatch(updateAlert(response.data.body.message));
	};

	const filterCountries = ({target: {value}}) => {
		const _countries = countriesJson.filter(country => country.toLowerCase().startsWith(value.toLowerCase()));
		setCountries([..._countries]);
	};

	return (
		<div className="form-container">
			<form>
				<div className="form-field">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={({ target: { value } }) => setEmail(value)}
					/>
				</div>
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
					<input
						type="password"
						placeholder="Confirm Password"
						value={confirmPassword}
						onChange={({ target: { value } }) =>
							setConfirmPassword(value)
						}
					/>
				</div>
				<div className="form-field">
					<input
						type="text"
						onClick={() => setShowCountryList(!showCountryList)}
						placeholder="Choose your country"
						readOnly
					/>
					<ul
						className={`country-list ${
							showCountryList
								? "show-country-list"
								: "hide-country-list"
						}`}
						onMouseLeave={() => setShowCountryList(false)}
					>
						<input type='text' onChange={filterCountries}/>
						{countries.map((_country) => {
							return (
								<li
									key={_country}
									className="country"
									onClick={() => setCountry(_country)}
								>
									<img
										src={`/countries/${_country}.png`}
										alt="Country"
									/>
									<p>{_country}</p>
								</li>
							);
						})}
					</ul>
					{country && (
						<div
							className="country selected-country"
							onClick={() => setShowCountryList(!showCountryList)}
						>
							<img
								src={`/countries/${country}.png`}
								alt="Country"
							/>
							<p>{country}</p>
						</div>
					)}
				</div>
				<div className="form-field">
					<input type="submit" value="Sign Up" onClick={signup} />
				</div>
				<div className="form-field">
					<Link to="/login">
						Already have an account? <span>Log in</span>
					</Link>
				</div>
			</form>
		</div>
	);
};

export default Signup;