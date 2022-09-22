import { useState, Fragment, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { links, settingLinks } from "../../utils/data";
import {
	showDropDown,
	hideDropDown,
	showSettings,
	hideSettings,
	resetNavbar,
} from "../../reducers/navbarSlice";
import { updateAlert, updateUser, logout } from "../../reducers/mainSlice";
import "../../styles/main/navbar.scss";
import urls from "../../utils/urls";
import { getProfilePicture } from "../../utils/utils";
import {TiTick} from 'react-icons/ti';

const Navbar = () => {
	const dispatch = useDispatch();
	const { pathname } = useLocation();
	const {
		navbar: { dropDown, settings },
		main: { user, isLoggedIn },
	} = useSelector((state) => state);
	const [showUsernameInput, setShowUsernameInput] = useState(false);
	const [usernameInput, setUsernameInput] = useState("");

	const initUpdateUsername = () => {
		setUsernameInput(user?.username || '');
		setShowUsernameInput(true);
	};

	const updateUsername = async (event) => {
		if(usernameInput !== user?.username) {
			const response = await axios.put(
				`${urls.updateUser}/${user._id}`,
				{ username: usernameInput },
				{ withCredentials: true }
			);
			if (response.data.success)
				dispatch(updateUser(response.data.body.user));
			else 
				dispatch(updateAlert(response.data.body.message));
		}
		setShowUsernameInput(false);
	};

	const uploadProfilePicture = async (event) => {
		const profilePicture = event.target.files[0];
		if (profilePicture && profilePicture.type.startsWith("image/")) {
			const formData = new FormData();
			formData.append("profilePicture", profilePicture);
			const response = await fetch(
				`${urls.uploadProfilePicture}/${user._id}`,
				{
					method: "PUT",
					body: formData,
					credentials: "include",
				}
			);
			const data = await response.json();
			if (data.success) dispatch(updateUser(data.body.user));
		}
	};

	const handleLogout = async () => {
		try {
			const response = await axios.post(
				urls.logout,
				{},
				{ withCredentials: true }
			);
			if (response.data.success) dispatch(logout());
		} catch (err) {}
	};

	useEffect(() => {
		dispatch(resetNavbar());
	}, [pathname, dispatch]);

	return (
		<nav className="navbar">
			<div className="left-navbar">
				<div className="logo">
					<Link to="/">
						<img src="/images/newlogo.png" alt="Logo" />
					</Link>
				</div>
			</div>
			<div className="hamburger">
				<GiHamburgerMenu
					onClick={() =>
						dispatch(dropDown ? hideDropDown() : showDropDown())
					}
				/>
			</div>
			<div className={`right-navbar ${dropDown ? "show" : "hide"}`}>
				{isLoggedIn ? (
					<ul className="links">
						{links.map((link) => {
							if (link.admin && !user?.isAdmin)
								return <Fragment key={link.title} />;
							return (
								<li
									key={link.title}
									className={
										pathname === link.to
											? "selected-link"
											: ""
									}
								>
									<Link to={link.to}>{link.title}</Link>
								</li>
							);
						})}
					</ul>
				) : (
					<div className="auth-btns">
						<Link to="/login">Login</Link>
						<Link to="/signup">Sign Up</Link>
					</div>
				)}
				{isLoggedIn && (
					<div className="avatar">
						<div className="upload-profile-picture">
							<img
								src={getProfilePicture(user?.profilePicture)}
								alt="Profile"
								className="profile-picture"
							/>
							<input
								type="file"
								accept="image/*"
								onChange={uploadProfilePicture}
							/>
						</div>
						<div className="info">
							{showUsernameInput ? (
								<div className="update-username">	
									<input
										type="text"
										value={usernameInput}
										onChange={({ target: { value } }) =>
											setUsernameInput(value)
										}
									/>
									<button onClick={updateUsername}>
										<TiTick/>
									</button>
								</div>
							) : (
								<p
									onClick={initUpdateUsername}
									className="username"
								>
									{user?.username}
								</p>
							)}
							<p className="ticket">Ticket - xxx</p>
						</div>
					</div>
				)}
				<ul className="link-icons">
					<li className="notification-link">
						<FaBell />
					</li>
					<li>
						<MdSettings
							onClick={() =>
								dispatch(
									settings ? hideSettings() : showSettings()
								)
							}
						/>
						{settings && (
							<ul
								className="settings"
								onMouseLeave={() => dispatch(hideSettings())}
							>
								{settingLinks.map((setting) => (
									<li
										key={setting.title}
										onClick={
											setting.title === "Log out"
												? handleLogout
												: () => {}
										}
									>
										<Link to={setting.to}>
											{setting.title}
										</Link>
									</li>
								))}
							</ul>
						)}
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
