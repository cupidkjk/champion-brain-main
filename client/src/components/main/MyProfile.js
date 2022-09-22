import {useDispatch, useSelector} from 'react-redux';
import {BiImageAdd} from 'react-icons/bi';
import axios from 'axios';
import urls from '../../utils/urls';
import {updateUser} from '../../reducers/mainSlice';
import {getProfilePicture} from '../../utils/utils';
import '../../styles/main/myProfile.scss';

const MyProfile = () => {
	const dispatch = useDispatch();
	const {user} = useSelector(state => state.main);

	const uploadProfilePicture = async (event) => {
		const profilePicture = event.target.files[0];
		if (profilePicture && profilePicture.type.startsWith("image/")) {
			const formData = new FormData();
			formData.append("profilePicture", profilePicture);
			const response = await fetch(`${urls.uploadProfilePicture}/${user._id}`, {
				method: 'PUT',
				body: formData,
				credentials: 'include',
			});
			const data = await response.json();
			if(data.success) 
				dispatch(updateUser(data.body.user));
		}
	};

	return (
		<div className='my-profile'>
			<h1>My Profile</h1>
			<div className='profile'>
				<div className='upload-profile-picture'>
					<img src={getProfilePicture(user.profilePicture)} alt='Profile' className='profile-picture'/>
					<input type='file' accept='image/*' onChange={uploadProfilePicture}/>
					<BiImageAdd/>
				</div>
				<div className='profile-info'>
					<div className='username'>	
						<p>{user.username}</p>
						<img src={`/countries/${user.country}.png`} className='flag' alt='Flag'/>
					</div>
					<p>{user.email}</p>
				</div>
			</div>
		</div>	
	);
};

export default MyProfile;