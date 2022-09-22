import { stats } from "../../utils/data";
import "../../styles/main/home.scss";
import { useSelector } from "react-redux";
import Leaderboard from "../game/Leaderboard";

const Home = () => {
	const { user } = useSelector((state) => state.main);

	return (
		<div className="home">
			<Leaderboard />
			<div className="stats-main-container">
				<div className="total-stats">
					<div className="total-stat">
						<div className='total-stat-heading'>
							<h1>Games Played</h1>
							<h1>{user?.gamesPlayed}</h1>
						</div>
						<img src='/gamesPlayed.png' alt='Games Played'/>
					</div>
					<div className="total-stat">
						<div className='total-stat-heading'>
							<h1>Score</h1>
							<h1>{user?.score}</h1>
						</div>
						<img src='/score.png' alt='Games Played'/>
					</div>
					<div className="total-stat">
						<div className='total-stat-heading'>
							<h1>Ranking</h1>
							<h1>{user?.rank}</h1>
						</div>
						<img src='/ranking.png' alt='Games Played'/>
					</div>
				</div>
				<div className="stats-container">
					{stats.map((stat) => {
						return (
							<div className="stats" key={stat.title}>
								<h3>{stat.title}</h3>
								<div className="results">
									<div className="result">
										<h4>Wins</h4>
										{!user?.stats[stat.name][3] ? (
											<div className='stat'>
												<p>{user?.stats[stat.name][0]}</p>
											</div>
										) : (
											<div className="result-stats">
												<div className="stat">
													<h5>3x</h5>
													<p>
														{
															user?.stats[
																stat.name
															][3][0]
														}
													</p>
												</div>
												<div className="stat">
													<h5>4x</h5>
													<p>
														{
															user?.stats[
																stat.name
															][4][0]
														}
													</p>
												</div>
												<div className="stat">
													<h5>5x</h5>
													<p>
														{
															user?.stats[
																stat.name
															][5][0]
														}
													</p>
												</div>
											</div>
										)}
									</div>
									<div className='result'>
										<h4>Losses</h4>
										{!user?.stats[stat.name][3] ? (
											<div className='stat no-border'>
												<p>{user?.stats[stat.name][1]}</p>
											</div>
										) : (
											<div className="result-stats">
												<div className="stat">
													<h5>3x</h5>
													<p>
														{
															user?.stats[
																stat.name
															][3][1]
														}
													</p>
												</div>
												<div className="stat">
													<h5>4x</h5>
													<p>
														{
															user?.stats[
																stat.name
															][4][1]
														}
													</p>
												</div>
												<div className="stat no-border">
													<h5>5x</h5>
													<p>
														{
															user?.stats[
																stat.name
															][5][1]
														}
													</p>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Home;