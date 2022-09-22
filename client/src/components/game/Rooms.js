import { Fragment, useEffect } from "react";
import "../../styles/game/rooms.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../store";
import { getProfilePicture } from "../../utils/utils";
import { playNowLinks } from "../../utils/data";
import {
	showPlayLinks,
	hidePlayLinks
} from "../../reducers/navbarSlice";

const Rooms = () => {
	const dispatch = useDispatch();
	const {
		navbar: {playLinks},
		main: { isLoggedIn },
		game: { room, rooms },
	} = useSelector((state) => state);
	const navigate = useNavigate();

	const joinRoom = ({ roomId, roomType }) => {
		if (!isLoggedIn) navigate("/login");
		socket.emit("join-room", { roomId, roomType });
	};

	const viewRoom = ({ roomId, roomType }) => {
		if (!isLoggedIn) navigate("/login");
		socket.emit("view-room", { roomId, roomType });
	};

	const getRoom = (_room) => {
		if (!_room || _room.gameOver) return <Fragment key={_room.id} />;
		return (
			<li className="room" key={_room.id}>
				<div className="room-info">
					<img
						src={getProfilePicture(_room.owner.user.profilePicture)}
						alt="Avatar"
						className="profile-picture"
					/>
					<p>{_room.owner.user.username}</p>
					<span>{_room.owner.user.score}</span>
				</div>
				{(!room || room.gameOver) && (
					<div className="room-actions">
						<input
							type="button"
							value="View"
							onClick={() =>
								viewRoom({
									roomId: _room.id,
									roomType: _room.roomType,
								})	
							}
						/>
						{!_room.gameStarted && (
							<input
								type="button"
								onClick={() =>
									joinRoom({
										roomId: _room.id,
										roomType: _room.roomType,
									})
								}
								value="Join"
							/>
						)}
					</div>
				)}
			</li>
		);
	};

	useEffect(() => {
		socket.emit("get-rooms");
		socket.on("room-joined", (roomType) =>
			navigate(`/twoPlayer/${roomType}`)
		);
	}, []);

	return (
		<div className="rooms-container">
			<h1>Rooms</h1>
			<div className="play-btn">
					{room && !room.gameOver ? (
						<Link to={`/twoPlayer/${room.roomType}`}>
							Go To Room
						</Link>
					) : (
						<>
							<button
								onClick={() =>
									dispatch(
										playLinks
											? hidePlayLinks()
											: showPlayLinks()
									)
								}
							>
								Play Now
							</button>
							{playLinks && (
								<ul
									className="play-links"
									onMouseLeave={() =>
										dispatch(hidePlayLinks())
									}
								>
									{playNowLinks.map((playLink) => (
										<li key={playLink.title}>
											<Link to={playLink.to}>
												{playLink.title}
											</Link>
										</li>
									))}
								</ul>
							)}
						</>
					)}
				</div>
			<div className="room-types">
				<div className="rooms two-rooms">
					<h2>3x Rooms</h2>
					<ul className="room-list">
						{rooms[3]?.length ? (
							rooms[3]?.map((_room) => getRoom(_room))
						) : (
							<p className="no-rooms">No rooms yet</p>
						)}
					</ul>
				</div>
				<div className="rooms three-rooms">
					<h2>4x Rooms</h2>
					<ul className="room-list">
						{rooms[4]?.length ? (
							rooms[4]?.map((_room) => getRoom(_room))
						) : (
							<p className="no-rooms">No rooms yet</p>
						)}
					</ul>
				</div>
				<div className="rooms five-rooms">
					<h2>5x Rooms</h2>
					<ul className="room-list">
						{rooms[5]?.length ? (
							rooms[5]?.map((_room) => getRoom(_room))
						) : (
							<p className="no-rooms">No rooms yet</p>
						)}
					</ul>
				</div>
				<div className="rooms five-players-rooms">
					<h2>5 players rooms</h2>
					<ul className="room-list">
						<p className="no-rooms">No rooms yet</p>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Rooms;
