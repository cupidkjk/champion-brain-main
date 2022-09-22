import {useState, useEffect} from 'react';
import { FaTrophy } from "react-icons/fa";
import "../../styles/game/leaderboard.scss";
import urls from '../../utils/urls';
import axios from 'axios';
import {getProfilePicture} from '../../utils/utils';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [userCount, setUserCount] = useState(0);

    const getLeaderboard = async () => {
        const response = await axios.get(`${urls.getAllUsers}?limit=10`);
        setLeaderboard(response.data.body.users);
        setUserCount(response.data.body.userCount);
    };

    useEffect(() => {
        getLeaderboard();
    }, []);

    return (
        <div className="leaderboard">
            <div className="heading">
                <h4>Leaderboard</h4>
                <p>Total Players - {userCount}</p>
                <img src='/leaderboard.png' avatar='Leaderboard' alt='Leaderboard'/>
            </div>
            <div className='first-rank rank'>
                <img src={getProfilePicture(leaderboard[0]?.profilePicture)} alt="Avatar" className="profile-picture" />
                <div className='rank-flag-score'>
                    <img className='flag' src={`/countries/${leaderboard[0]?.country}.png`} alt="Flag" />
                    <b>{leaderboard[0]?.score}</b>
                </div>
                <div className='rank-position-info'>
                    <FaTrophy style={{color: '#FFD700'}}/>
                    <p>{leaderboard[0]?.username}</p>
                </div>
            </div>
            <div className="second-third">
                <div className="second-third-rank rank">
                    <div className='rank-main'>
                        <img src={getProfilePicture(leaderboard[1]?.profilePicture)} alt="Avatar" className="profile-picture" />
                        <div className='rank-position-info'>
                            <FaTrophy style={{color: '#C0C0C0'}}/>
                            <div className='rank-stats'>
                                <img className='flag' src={`/countries/${leaderboard[1]?.country}.png`} alt="Flag" />
                                <b>{leaderboard[1]?.score}</b>
                            </div>
                        </div>
                    </div>
                    <p>{leaderboard[1]?.username}</p>
                </div>
                <div className="second-third-rank rank">
                    <div className='rank-main'>
                        <img src={getProfilePicture(leaderboard[2]?.profilePicture)} alt="Avatar" className="profile-picture" />
                        <div className='rank-position-info'>
                            <FaTrophy style={{color: '#CD7F32'}}/>
                            <div className='rank-stats'>
                                <img className='flag' src={`/countries/${leaderboard[2]?.country}.png`} alt="Flag" />
                                <b>{leaderboard[2]?.score}</b>
                            </div>
                        </div>
                    </div>
                    <p>{leaderboard[2]?.username}</p>
                </div>
            </div>
            <div className="rankings">
                {leaderboard.slice(3)?.map(player => {
                    return (
                        <div className='rank' key={player?._id}>
                            <div className='rank-info'>
                                <img src={getProfilePicture(player?.profilePicture)} alt="Avatar" className="profile-picture" />
                                <p>{player?.username}</p>
                            </div>
                            <div className='rank-stats'>
                                <b>{player?.score}</b>
                                <img className='flag' src={`/countries/${player?.country}.png`} alt="Flag" />
                                <span>{player?.rank}</span>
                            </div>
                        </div>    
                    );
                })}
            </div>
        </div>
    );
};

export default Leaderboard;