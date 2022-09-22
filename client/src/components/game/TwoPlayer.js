import { useState, useEffect } from "react";
import { socket } from "../../store";
import Loading from "../utils/Loading";
import "../../styles/game/twoPlayer.scss";
import { getProfilePicture } from "../../utils/utils";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const TwoPlayer = () => {
	const [newGuess, setNewGuess] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const {
		main: { user },
		game: { room },
	} = useSelector((state) => state);
	const params = useParams();
	const navigate = useNavigate();

	const setNumber = (event) => {
		event.preventDefault();
		if (room)
			socket.emit("set-number", {
				number: newNumber,
				roomType: room.roomType,
				roomId: room.id,
			});
	};

	const makeGuess = (event) => {
		event.preventDefault();
		if (room && room.numberCount === room.playerCount && !room.gameOver) {
			socket.emit("make-guess", {
				guess: newGuess,
				roomType: room.roomType,
				roomId: room.id,
			});
			setNewGuess("");
		}
	};

	const leaveRoom = () => {
		if (room) {
			navigate("/");
			socket.emit("leave-room", {
				roomType: room.roomType,
				roomId: room.id,
			});
		}
	};

	const createRoom = () => {
		setNewNumber("");
		setNewGuess("");
		if (params.roomType && (!room || room.gameOver))
			socket.emit("create-room", params.roomType);
	};

	useEffect(() => {
		createRoom();
	}, [params.roomType]);

	return (
		<div className="two-player">
			<div className="top-container">
				{room?.gameOver && (
					<div className="game-winner">
						<p>Game Over</p>
						{room?.winner?.user.username && (
							<h2>
								<span>{room.winner.user.username}</span> won
							</h2>
						)}
						{room?.owner.user._id.toString() ===
							user._id.toString() && (
							<input
								type="button"
								className="play-again"
								to={`/twoPlayer/${room.roomType}`}
								value="Play Again"
								onClick={createRoom}
							/>
						)}
					</div>
				)}
				{!room?.viewer ? (
					<form className="game-input">
						{room?.number ? (
							<div className="my-number">
								<p>Your Number</p>
								<h2>{room?.number}</h2>
							</div>
						) : (
							!room?.gameOver && (
								<>
									<p>
										Choose a {params.roomType} digit number
									</p>
									<input
										type="number"
										value={newNumber}
										onChange={({ target: { value } }) =>
											setNewNumber(value)
										}
									/>
									<input
										type="submit"
										value="Confirm"
										onClick={setNumber}
									/>
								</>
							)
						)}
					</form>
				) : (
					<div className="game-input">
						<p>Spectating {room?.owner?.user?.username}'s room</p>
					</div>
				)}
			</div>
			<div className="game-screen-container">
				<div className="game-screen">
					{room?.players?.length === room?.playerCount ? (
						<>
							<div className="game-players">
								{room?.players?.map((player, i) => {
									return (
										<div
											className="game-player"
											key={player.socketId}
										>
											<div className="player">
												<img
													src={getProfilePicture(
														player?.user
															.profilePicture
													)}
													alt="Avatar"
													className="profile-picture"
												/>
												<h4
													className={
														user?._id ===
														player?.user?._id
															? "my-username"
															: ""
													}
												>
													{player?.user.username}
												</h4>
											</div>
											{room?.gameOver && room.numbers[i] && (
												<div className="original-number">
													<b>{room.numbers[i]}</b>
												</div>
											)}
											{room?.numberCount ===
												room?.playerCount && (
												<>
													{user?._id ===
														player?.user?._id &&
														!room?.gameOver && (
															<form className="guess-input">
																<input
																	type="number"
																	placeholder="Guess"
																	value={
																		newGuess
																	}
																	onChange={({
																		target: {
																			value,
																		},
																	}) =>
																		setNewGuess(
																			value
																		)
																	}
																/>
																<input
																	type="submit"
																	value="Guess"
																	onClick={
																		makeGuess
																	}
																/>
															</form>
														)}
													<div className="guesses">
														<p className="guess-count">
															Guess Count{" "}
															<span>
																{
																	room
																		?.guesses[
																		i
																	].length
																}
															</span>
														</p>
														{room?.guesses[i]?.map(
															(guess, j) => {
																return (
																	<div
																		className="guess"
																		key={j}
																	>
																		<h4>
																			{
																				guess.number
																			}
																		</h4>
																		<p>
																			Y{" "}
																			<span>
																				{
																					guess.y
																				}
																			</span>
																		</p>
																		<p>
																			N{" "}
																			<span>
																				{
																					guess.n
																				}
																			</span>
																		</p>
																	</div>
																);
															}
														)}
													</div>
												</>
											)}
										</div>
									);
								})}
							</div>
							{room?.numberCount !== 2 && (
								<div className="game-loading">
									<Loading />
									<p>
										Waiting for players to choose numbers...
									</p>
								</div>
							)}
						</>
					) : (
						<div className="game-loading">
							<Loading />
							<p>Waiting for a player to join...</p>
						</div>
					)}
				</div>
				<div className="spectators">
					<p>Spectating ({room?.viewers.length})</p>
					<ul>
						{room?.viewers.map((viewer) => {
							return (
								<li key={viewer.user._id}>
									<img
										src={getProfilePicture(
											viewer?.user.profilePicture
										)}
										alt="Avatar"
										className="profile-picture"
									/>
									<span>{viewer.user.username}</span>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<div className="leave-room">
				<input type="button" value="Leave Room" onClick={leaveRoom} />
			</div>
		</div>
	);
};

export default TwoPlayer;
