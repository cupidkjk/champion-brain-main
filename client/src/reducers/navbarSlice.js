import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	dropDown: false,
	playLinks: false,
	settings: false,
};

export const navbarSlice = createSlice({
	name: "navbar",
	initialState,
	reducers: {
		showDropDown: (state) => {
			state.playLinks = false;
			state.settings = false;
			state.dropDown = true;
		},
		hideDropDown: (state) => {
			state.dropDown = false;
		},
		showPlayLinks: (state) => {
			state.dropDown = false;
			state.settings = false;
			state.playLinks = true;
		},
		hidePlayLinks: (state) => {
			state.playLinks = false;
		},
		showSettings: (state) => {
			state.dropDown = false;
			state.playLinks = false;
			state.settings = true;
		},
		hideSettings: (state) => {
			state.settings = false;
		},
		resetNavbar: (state) => {
			state.dropDown = false;
			state.playLinks = false;
			state.settings = false;
		},
	},
});

export const {
	showDropDown,
	hideDropDown,
	showPlayLinks,
	hidePlayLinks,
	showSettings,
	hideSettings,
	resetNavbar,
} = navbarSlice.actions;

export default navbarSlice.reducer;