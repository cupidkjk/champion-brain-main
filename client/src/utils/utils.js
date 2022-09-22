export const getProfilePicture = (filename) => {
	return `${process.env.REACT_APP_IMAGEKIT}${filename}`; 
};

export const getFormattedTimestamp = (dateTime) => {
	const current = new Date(dateTime);
	const date = `${current.getDate()}/${
		current.getMonth() + 1
	}/${current.getFullYear()}`;

	const minutes = "0" + current.getMinutes().toString();
	const hours = "0" + current.getHours().toString();

	const time = `${hours.slice(hours.length - 2, 3)}:${minutes.slice(
		minutes.length - 2,
		3
	)}`;
	return date + " - " + time;
};