import { useLayoutEffect, useRef, useEffect, useState } from "react";
import Picker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";
import { MdUpload, MdSend } from "react-icons/md";
import { useSelector } from "react-redux";
import Sidebar from "../utils/Sidebar";
import { socket } from "../../store";
import { getFormattedTimestamp, getProfilePicture } from "../../utils/utils";
import axios from "axios";
import urls from "../../utils/urls";

import "../../styles/chats/chatBox.scss";

const ChatBox = () => {
	const { isLoggedIn, user } = useSelector((state) => state.main);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [conversation, setConversation] = useState([]);
	const conversationRef = useRef(null);

	const onEmojiClick = (event, emojiObject) => {
		setNewMessage((_newMessage) => _newMessage + emojiObject.emoji);
	};

	const sendMessage = (event) => {
		event.preventDefault();
		if (isLoggedIn && newMessage) {
			socket.emit("global-message", newMessage);
			setNewMessage("");
		}
	};

	const getGlobalMessages = async () => {
		const response = await axios.get(urls.getGlobalMessages, {
			withCredentials: true,
		});
		if (response.data.success) setConversation(response.data.body.messages);
	};

	useLayoutEffect(() => {
		if (conversationRef.current)
			conversationRef.current.scrollTop =
				conversationRef.current.scrollHeight -
				conversationRef.current.clientHeight;
	}, [conversation]);

	useEffect(() => {
		getGlobalMessages();
		socket.on("global-message", (message) => {
			setConversation((_conversation) => [..._conversation, message]);
		});
	}, []);

	return (
		<Sidebar position={"right"} width={350}>
			<div className={`chat-box ${isLoggedIn ? '' : 'chat-box-not-logged-in'}`}>
				<div className="chat-name">
					<p>Global Chat</p>
				</div>
				<div className="conversation" ref={conversationRef}>
					{conversation.map((message) => {
						return (
							<div
								className={`message ${
									user?._id === message?.from?._id
										? "sent"
										: "received"
								}`}
								key={message?._id}
							>
								<img
									src={getProfilePicture(
										message.from?.profilePicture
									)}
									alt="Avatar"
									className="profile-picture"
								/>
								<div className="text">
									<div className="username">
										<p>{message.from?.username}</p>
									</div>
									<div>
										<p>{message.text}</p>
										<span>
											{getFormattedTimestamp(
												message.dateTime
											)}
										</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
				{isLoggedIn && (
					<form className="send-message">
						<div className="send-actions">
							<div>
								<MdUpload/>
							</div>
							<div className="emoji-picker">
								<FaSmile
									onClick={() =>
										setShowEmojiPicker(!showEmojiPicker)
									}
								/>
								{showEmojiPicker && (
									<Picker onEmojiClick={onEmojiClick} />
								)}
							</div>
							<button
								type="submit"
								className="send-button"
								onClick={sendMessage}
							>
								<MdSend />
							</button>
						</div>
						<input
							type="text"
							placeholder="Enter your message"
							value={newMessage}
							onChange={({ target: { value } }) =>
								setNewMessage(value)
							}
						/>
					</form>
				)}
			</div>
		</Sidebar>
	);
};

export default ChatBox;