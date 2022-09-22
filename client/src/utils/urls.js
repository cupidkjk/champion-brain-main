const URL = process.env.REACT_APP_API;

const urls = {
	socket: `${URL}`,
	login: `${URL}/auth/login`,
	signup: `${URL}/auth/signup`,
	logout: `${URL}/auth/logout`,
	refresh: `${URL}/auth/refresh`,
	getAllUsers: `${URL}/user/getAllUsers`,
	uploadProfilePicture: `${URL}/user/uploadProfilePicture`,
	getGlobalMessages: `${URL}/message/getGlobalMessages`,
	makeAdmin: `${URL}/user/makeAdmin`,
	updateUser: `${URL}/user/updateUser`,
};

export default urls;