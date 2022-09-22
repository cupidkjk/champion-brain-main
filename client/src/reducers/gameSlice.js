import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	room: null,
	alert: '',
	rooms: {},
};

export const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		updateRoom: (state, action) => {
			state.room = action.payload;
		},
		updateAlert: (state, action) => {
			state.alert = action.payload;
		},
		updateRooms: (state, action) => {
			state.rooms = action.payload;
		},
	},
});

export const {
	updateRoom,
	updateAlert,
	updateRooms,
} = gameSlice.actions;

export default gameSlice.reducer;