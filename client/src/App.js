import { useLayoutEffect, useState, useEffect } from "react";
import {
	Routes,
	Route,
	Navigate,
	useLocation
} from "react-router-dom";
import Navbar from "./components/main/Navbar";
import Home from "./components/main/Home";
import Signup from "./components/main/Signup";
import Login from "./components/main/Login";
import ChatBox from "./components/chats/ChatBox";
import Rooms from "./components/game/Rooms";
import TwoPlayer from "./components/game/TwoPlayer";
import Help from "./components/main/Help";
import Admin from "./components/main/Admin";
import ProtectedRoute from "./components/router/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, login, resetAlert, updateAlert } from "./reducers/mainSlice";
import { updateRooms, updateRoom } from "./reducers/gameSlice";
import axios from "axios";
import urls from "./utils/urls";
import { socket } from "./store";
import {chatBoxRoutes} from './utils/data';

const App = () => {
	const dispatch = useDispatch();
	const { isLoggedIn, alert } = useSelector((state) => state.main);
	const [showChatBox, setShowChatBox] = useState(false);
	const location = useLocation();

	const refresh = async () => {
		try {
			const response = await axios.post(
				urls.refresh,
				{},
				{ withCredentials: true }
			);
			if (response.data.success) dispatch(login(response.data.body.user));
		} catch {}
	};

	useEffect(() => {
		refresh();
		socket.on("room-data", (roomData) => {
			dispatch(updateRoom(roomData));
			if(roomData.winner) 
				dispatch(updateUser(roomData.user))
		});
		socket.on("room-list", (roomList) => {
			const _rooms = {};
			for(let roomType in roomList) {
				_rooms[roomType] = [];
				for(let room of Object.values(roomList[roomType])) 
					_rooms[roomType].push(room);
			}
			console.log(_rooms);
			dispatch(updateRooms(_rooms));
		});
		socket.on("room-error", (alert) => dispatch(updateAlert(alert)));
	}, []);

	useEffect(() => {
		if (alert)
			setTimeout(() => {
				dispatch(resetAlert());
			}, 5000);
	}, [alert, dispatch]);

	useLayoutEffect(() => {
		if(chatBoxRoutes.includes(location.pathname)) 
			setShowChatBox(true);
		else 
			setShowChatBox(false);
	}, [location]);

	return (
		<section>
			<p className={`alert ${alert ? "show-alert" : "hide-alert"}`}>
				{alert}
			</p>
			<Navbar />
			<main className='main-container'>
				<Routes>
					<Route
						path="/signup"
						element={
							isLoggedIn ? <Navigate to="/" /> : <Signup />
						}
					/>
					<Route
						path="/login"
						element={
							isLoggedIn ? <Navigate to="/" /> : <Login />
						}
					/>
					<Route path="/rooms" element={<Rooms />} />
					<Route
						path="/twoPlayer/:roomType"
						element={
							<ProtectedRoute path="/login">
								<TwoPlayer />
							</ProtectedRoute>
						}
					/>
					<Route path="/help" element={<Help />} />
					<Route
						path="/admin"
						element={
							<ProtectedRoute path="/rooms">
								<Admin />
							</ProtectedRoute>
						}
					/>
					<Route
						exact
						path="/"
						element={
							<ProtectedRoute path="/rooms">
								<Home />
							</ProtectedRoute>
						}
					/>
				</Routes>
				{showChatBox && <ChatBox />}
			</main>
		</section>
	);
};

export default App;