import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import urls from "../../utils/urls";
import "../../styles/main/admin.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateAlert } from "../../reducers/mainSlice";
import {getProfilePicture} from '../../utils/utils';

const Admin = () => {
	const { user } = useSelector((state) => state.main);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [users, setUsers] = useState([]);

	const getAllUsers = async () => {
		const response = await axios.get(urls.getAllUsers, {
			withCredentials: true,
		});
		if (response.data.success) {
			const _users = response.data.body.users.sort(
				(user1, user2) => Number(user2.isAdmin) - Number(user1.isAdmin)
			);
			setUsers(_users);
		} else navigate("/");
	};

	const makeAdmin = async (_id) => {
		if (user.isAdmin) {
			const response = await axios.put(
				urls.makeAdmin,
				{ _id },
				{ withCredentials: true }
			);
			if (response.data.success) {
				const _users = users.map((_user) => {
					if (_user._id === _id) return { ..._user, isAdmin: true };
					return _user;
				});
				setUsers([..._users]);
				dispatch(updateAlert(response.data.body.message));
			}
		}
	};

	useEffect(() => {
		getAllUsers();
	}, []);

	return (
		<div className="admin-dashboard">
			<h1>Admin Dashboard</h1>
			<h2>Users</h2>
			<div className='all-users-container'>
				<table className="all-users">
					<thead>
						<tr>
							<th></th>
							<th>Username</th>
							<th>Email</th>
							<th>Country</th>
							<th>Is Admin</th>
							<th>3x</th>
							<th>4x</th>
							<th>5x</th>
							<th>Score</th>
							<th>Ranking</th>
						</tr>
					</thead>
					<tbody>
						{users.map((_user, i) => {
							return (
								<tr key={_user._id}>
									<td>{i + 1}</td>
									<td>
										<img src={getProfilePicture(_user.profilePicture)} alt='Avatar' className='profile-picture'/>
										{_user.username}
									</td>
									<td>{_user.email}</td>
									<td>
										<img
											className="flag"
											src={`/countries/${_user.country}.png`}
											alt="Flag"
										/>
										<span>{_user.country}</span>
									</td>
									<td>
										<span>
											{_user.isAdmin ? "Yes" : "No"}
										</span>
										{user.isAdmin && !_user.isAdmin && (
											<input
												className="make-admin-btn"
												type="button"
												value="Make Admin"
												onClick={() =>
													makeAdmin(_user._id)
												}
											/>
										)}
									</td>
									<td>{_user.stats.two_player[3][0]} / {_user.stats.two_player[3][1]}</td>
									<td>{_user.stats.two_player[4][0]} / {_user.stats.two_player[4][1]}</td>
									<td>{_user.stats.two_player[5][0]} / {_user.stats.two_player[5][1]}</td>
									<td>{_user.score}</td>
									<td>{_user.rank}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Admin;