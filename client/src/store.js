import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./reducers/navbarSlice";
import gameReducer from "./reducers/gameSlice";
import mainReducer from "./reducers/mainSlice";
import socketIo from 'socket.io-client';
import urls from './utils/urls';

export const socket = socketIo(urls.socket, {withCredentials: true});

export const store = configureStore({
	reducer: {
		main: mainReducer,
		navbar: navbarReducer,
		game: gameReducer,
	},
});