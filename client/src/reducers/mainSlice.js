import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLoggedIn: false,
	user: {},
	alert: "",
};

export const mainSlice = createSlice({
	name: "main",
	initialState,
	reducers: {
		logout: (state) => {
			state.isLoggedIn = false;
			state.user = {};
			state.alert = "Logged out successfully";
		},
		login: (state, action) => {
			state.isLoggedIn = true;
			state.user = action.payload;
			state.alert = "Logged in successfully";
		},
		updateUser: (state, action) => {
			state.user = action.payload;
		},
		connectSocket: (state, action) => {
			state.socket = action.payload;
		},
		disconnectSocket: (state, action) => {
			state.socket = null;
		},
		updateAlert: (state, action) => {
			state.alert = action.payload;
		},
		resetAlert: (state) => {
			state.alert = "";
		},
	},
});

export const {
	logout,
	login,
	updateAlert,
	resetAlert,
	connectSocket,
	disconnectSocket,
	updateUser,
} = mainSlice.actions;

export default mainSlice.reducer;