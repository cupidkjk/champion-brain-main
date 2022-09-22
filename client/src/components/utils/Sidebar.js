import { useState } from "react";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import '../../styles/utils/sidebar.scss';

const Sidebar = ({ children, width, position }) => {
	const [showSidebar, setShowSidebar] = useState(false);

	return (
		<div
			className={`sidebar`}
			style={
				showSidebar
					? position === "left"
						? { left: "0%", flexDirection: 'row-reverse' }
						: { right: "0%" }
					: position === "left"
					? { left: `-${width}px`, flexDirection: 'row-reverse' }
					: { right: `-${width}px` }
			}
		>
			<div
				className="slider"
				onClick={() => setShowSidebar(!showSidebar)}
			>
				<button>
					{showSidebar ? (
						position === 'left' ? <BsChevronDoubleLeft/> : <BsChevronDoubleRight />
					) : (
						position === 'right' ? <BsChevronDoubleLeft/> :<BsChevronDoubleRight />
					)}
				</button>
			</div>
			<div className='child' style={{width: width}}>
				{children}
			</div>
		</div>
	);
};

export default Sidebar;